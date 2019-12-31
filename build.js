const fs = require('fs');
const fse = require('fs-extra');
const sass = require('node-sass');
const less = require('less');
const globby = require('globby');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const jade = require('jade');
const path = require('path');
const uglify = require('uglify-js');
const argv = require('yargs').argv;
const assert = require('assert');
const requirejs = require('requirejs');

const LANGUAGES = ['zh', 'en'];
const projectDir = __dirname;

/**
 * ------------------------------------------------------------------------
 * Usage:
 *
 * ```shell
 * node build.js --env asf
 * node build.js --env echartsjs
 * node build.js --env dev # the same as "debug"
 * # Check `./config` to see the available env
 * ```
 * ------------------------------------------------------------------------
 */

function initEnv() {
    var envType = argv.env;
    var isDev = argv.dev != null || argv.debug != null || envType === 'debug' || envType === 'dev';

    if (isDev) {
        console.warn('====================================================================');
        console.warn('THIS IS IN DEV MODE');
        console.warn('!!! Please input your local host in `config/env.dev.js` firstly !!!');
        console.warn('====================================================================');
        envType = 'dev';
    }

    if (!envType) {
        throw new Error('--env MUST be specified');
    }

    var config = require('./config/env.' + envType);

    if (isDev) {
        console.warn('====================================================================');
        console.warn('Please visit the website: ');
        console.warn(config.host);
        console.warn('====================================================================');
    }


    assert(path.isAbsolute(config.releaseDestDir));

    // Update home version each build.
    config.homeVersion = +new Date();

    config.downloadVersion = '4.6.0';

    return config;
}

async function releaseClean(config) {
    fse.ensureDirSync(config.releaseDestDir);

    for (let lang of LANGUAGES) {
        fse.ensureDirSync(path.resolve(config.releaseDestDir, lang));
    }

    console.log('\nclean done.');
}

async function buildSASS(config) {
    for (let lang of LANGUAGES) {
        let cssContent = await new Promise((resolve, reject) => {
            sass.render({
                file: path.resolve(projectDir, '_scss/main.scss'),
                includePaths: ['scss'],
                outputStyle: 'compressed'
            }, function (err, result) {
                if (err) {
                    console.error(chalk.red(err));
                    reject();
                }
                else {
                    resolve(result.css);
                }
            });
        });

        const result = await postcss(
            autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})
        ).process(cssContent, {
            map: false,
            from: undefined
        });

        let destDir = path.resolve(config.releaseDestDir, lang, 'css');
        fse.ensureDirSync(destDir);
        let destPath = path.resolve(destDir, 'main.css');
        fs.writeFileSync(destPath, result.css, 'utf8');
        console.log(chalk.green(`generated: ${destPath}`));
    }

    console.log('buildSASS done.');
}

async function buildJade(config) {
    const basePath = path.resolve(projectDir, '_jade');
    const srcPaths = await globby([
        '**/*.jade'
    ], {
        cwd: basePath
    });

    for (let srcPath of srcPaths) {
        let filePath = path.resolve(basePath, srcPath);
        let compiledFunction = jade.compileFile(filePath);

        let html = compiledFunction(config);

        let destPath = path.resolve(config.releaseDestDir, srcPath.replace('.jade', '.html'));
        let destDir = path.dirname(destPath);
        fse.ensureDirSync(destDir);
        fs.writeFileSync(destPath, html, 'utf8');

        console.log(chalk.green(`generated: ${destPath}`));
    }

    console.log('buildJade done.');
}

async function buildJS(config) {
    const srcRelativePathList = await globby([
        'js/*.js'
    ], {
        cwd: projectDir
    });


    for (let srcRelativePath of srcRelativePathList) {
        let srcAbsolutePath = path.resolve(projectDir, srcRelativePath);
        let content = fs.readFileSync(srcAbsolutePath, 'utf8');
        let code = uglify.minify(content).code;

        for (let lang of LANGUAGES) {
            let destDir = path.resolve(config.releaseDestDir, lang);
            fse.ensureDirSync(destDir);
            let destPath = path.resolve(destDir, srcRelativePath);
            fs.writeFileSync(destPath, code, 'utf8');

            console.log(chalk.green(`generated: ${destPath}`));
        }
    }

    console.log('buildJS done.');
}

async function copyResource(config) {
    const srcRelativePathList = await globby([
        'vendors/**/*',
        'images/**/*',
        'js/spreadsheet/*.tpl.html',
        'asset/map/**/*',
        'asset/theme/**/*',
        'builder/**/*',
        'dist/**/*',
        'video/**/*'
    ], {
        cwd: projectDir
    });

    console.log();

    for (let i = 0; i < srcRelativePathList.length; i++) {
        let srcRelativePath = srcRelativePathList[i];
        let srcAbsolutePath = path.resolve(projectDir, srcRelativePath);
        let destAbsolutePath = path.resolve(config.releaseDestDir, srcRelativePath);
        let destAbsoluteDir = path.dirname(destAbsolutePath);
        fse.ensureDirSync(destAbsoluteDir);
        fs.copyFileSync(srcAbsolutePath, destAbsolutePath);

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write('(' + (i + 1) + '/' + srcRelativePathList.length + ') ' + chalk.green(`resource copied to: ${destAbsolutePath}`));
    }

    console.log('\ncopyResources done.');
}

async function updateSourceVersion(config) {
    let filePath = path.resolve(config.releaseDestDir, 'builder/echarts.html');
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/(urlArgs:\s*\'v=)([0-9rc\.-]+)\'/, '$1' + config.homeVersion + '\'');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(chalk.green(`sourceVersion updated: ${filePath}`));
}

async function buildLegacyDoc(config) {
    // Build JS
    let jsDestPathZH = path.resolve(config.releaseDestDir, 'zh/js/docTool/main.js');
    let jsDestPathEN = path.resolve(config.releaseDestDir, 'en/js/docTool/main.js');

    let docToolConfig = {
        optimize: 'uglify',
        // optimize: 'none',
        name: 'docTool/main',
        exclude: ['globalArgs', 'prettyPrint'],
        out: jsDestPathZH,
        baseUrl: './legacy/js',
        paths: {
            dt: '../../vendors/dt/0.0.1',
            tpl: '../../vendors/dt/0.0.1/tplLoader',
            etpl: '../../vendors/etpl/3.0.0/etpl.min',
            signals: '../../vendors/signals/1.0.0/signals.min',
            hasher: '../../vendors/hasher/1.2.0/hasher.min',
            jquery: '../../vendors/jquery/jquery.min',
            perfectScrollbar: '../../vendors/perfect-scrollbar/0.6.8/js/perfect-scrollbar'
        },
        rawText: {
            'globalArgs': 'define(function () {});',
            'prettyPrint': 'define(function () {});'
        }
    };

    await new Promise((reslove, reject) => {
        requirejs.optimize(
            docToolConfig,
            function () {
                fse.ensureDirSync(path.dirname(jsDestPathEN));
                fse.copyFileSync(jsDestPathZH, jsDestPathEN);
                reslove();
            },
            function (error) {
                console.error(chalk.red(`buildLegacyDoc requirejs ${error.message}`));
                process.exit(1);
            }
        );
    });

    // Build less
    let cssSrcPath = path.resolve(projectDir, 'legacy/js/docTool/ecOption.less');
    let cssContent = fs.readFileSync(cssSrcPath, 'utf8');
    let cssResult;
    try {
        cssResult = await less.render(cssContent, {
            paths: ['vendors'],
            javascriptEnabled: true,
            compress: true
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
    let cssDestPathZH = path.resolve(config.releaseDestDir, 'zh/css/ecOption.css');
    fs.writeFileSync(cssDestPathZH, cssResult.css, 'utf8');
    let cssDestPathEN = path.resolve(config.releaseDestDir, 'en/css/ecOption.css');
    fs.writeFileSync(cssDestPathEN, cssResult.css, 'utf8');

    // Copy option3.json
    let option3SrcPath = path.resolve(projectDir, 'legacy/option3.json');
    let option3DestPath = path.resolve(config.releaseDestDir, 'zh/documents/option3.json');
    fse.copyFileSync(option3SrcPath, option3DestPath);

    console.log('\nBuild legacy doc done.');
}

async function buildSpreadsheet(config) {
    // Build JS
    let jsDestPathZH = path.resolve(config.releaseDestDir, 'zh/js/spreadsheet/spreadsheet.js');
    let jsDestPathEN = path.resolve(config.releaseDestDir, 'en/js/spreadsheet/spreadsheet.js');

    let spreadsheetConfig = {
        optimize: 'uglify',
        // optimize: 'none',
        name: 'spreadsheet/spreadsheet',
        exclude: ['globalArgs'],
        out: jsDestPathZH,
        baseUrl: './js',
        paths: {
            dt: '../vendors/dt/0.0.1',
            tpl: '../vendors/dt/0.0.1/tplLoader',
            etpl: '../vendors/etpl/3.0.0/etpl.min',
            signals: '../vendors/signals/1.0.0/signals.min',
            hasher: '../vendors/hasher/1.2.0/hasher.min',
            jquery: '../vendors/jquery/jquery.min',
            jquerymousewheel: '../vendors/jquery-mousewheel/3.1.11/jquery.mousewheel.min',
            handsontable: '../vendors/handsontable/0.26.1/dist/handsontable.full.min',
            latinize: '../vendors/latinize/latinize',
            numeral: '../vendors/numeral/1.4.7/numeral.min',
            immutable: '../vendors/immutable/3.7.4/dist/immutable'
        },
        rawText: {
            'globalArgs': 'define(function () {});'
        }
    };

    await new Promise((resolve, reject) => {
        requirejs.optimize(
            spreadsheetConfig,
            function () {
                fse.ensureDirSync(path.dirname(jsDestPathEN));
                fse.copyFileSync(jsDestPathZH, jsDestPathEN);
                reslove();
            },
            function (error) {
                console.error(chalk.red(`buildSpreadsheet requirejs failed ${error.message}`));
                process.exit(1);
            }
        );
    });

    // Build less
    let cssSrcPath = path.resolve(projectDir, 'js/spreadsheet/spreadsheet.less');
    let cssContent = fs.readFileSync(cssSrcPath, 'utf8');
    let cssResult;
    try {
        cssResult = await less.render(cssContent, {
            paths: ['vendors'],
            javascriptEnabled: true,
            compress: true
        });
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
    let cssDestPathZH = path.resolve(config.releaseDestDir, 'zh/css/spreadsheet.css');
    fs.writeFileSync(cssDestPathZH, cssResult.css, 'utf8');
    let cssDestPathEN = path.resolve(config.releaseDestDir, 'en/css/spreadsheet.css');
    fs.writeFileSync(cssDestPathEN, cssResult.css, 'utf8');

    console.log('\nBuild spreadsheet done.');
}


async function run() {
    const config = initEnv();

    await releaseClean(config);
    await buildSASS(config);
    await buildJade(config);
    await buildJS(config);
    await copyResource(config);
    await updateSourceVersion(config);

    await buildLegacyDoc(config);
    await buildSpreadsheet(config);

    console.log('All done.');
}

run();
