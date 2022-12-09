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
const readline = require('readline');
const md5 = require('md5');

const LANGUAGES = ['zh', 'en'];
const projectDir = path.resolve(__dirname, '..');

/**
 * ----------------------------------------------------------------------------------
 * Usage:
 *
 * ```shell
 * node build.js --env asf # build all for asf
 * node build.js --env echartsjs # build all for echartsjs.
 * node build.js --env localsite # build all for localsite.
 * # Check `../config` to see the available env
 *
 * node build.js --env asf --clean
 * node build.js --env echartsjs --clean
 * node build.js --env localsite --clean
 *
 * # Build all files by default.
 * # If you wish to build sass and jade only:
 * node build.js --env localsite --filter=sass,jade
 * # Supported: sass,jade,js
 * ```
 * ----------------------------------------------------------------------------------
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

    var config = require('../config/env.' + envType);

    if (isDev) {
        console.warn('====================================================================');
        console.warn('Please visit the website: ');
        console.warn(config.host);
        console.warn('====================================================================');
    }

    var filter = argv.filter || 'all';
    if (argv.filter) {
        console.warn('====================================================================');
        console.warn('Build only: ' + argv.filter);
        console.warn('====================================================================');
    }
    config.filter = filter;

    assert(path.isAbsolute(config.releaseDestDir));

    config.getAssetUrl = function (cdnPayRoot, filePath) {
        const fullFilePath = path.join(config.releaseDestDir, filePath);
        let content;
        try {
            content = fs.readFileSync(fullFilePath, 'utf-8');
        }
        catch (e) {
            throw new Error(`Unkown file ${fullFilePath}`);
        }
        const hash = md5(content);
        return cdnPayRoot + '/' + filePath + '?_v_=' + hash.substr(-10);
    };
    // Update home version each build.
    config.homeVersion = +new Date();
    // Temp: give a fixed version until need to update.
    config.cdnPayVersion = '20200710_1';

    config.downloadVersion = '5.0.0';

    config.envType = envType;

    config.copyRightYear = new Date().getFullYear();

    return config;
}

async function clean(config) {
    let destDir = path.resolve(config.releaseDestDir);

    fse.ensureDirSync(destDir);

    const srcRelativePathList = await globby([
        '**/*',
        '!.*', // .git .gitignore .htaccess .scripts .github
        '!v4/**/*', // v4 website
        '!README.md',
        '!package.json'
    ], {
        cwd: destDir
    });

    for (let i = 0; i < srcRelativePathList.length; i++) {
        let srcRelativePath = srcRelativePathList[i];
        let srcAbsolutePath = path.resolve(destDir, srcRelativePath);

        fs.unlinkSync(srcAbsolutePath);

        replaceLog(chalk.blue('deleted files: ' + (i + 1) + '/' + srcRelativePathList.length + '. '));
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

        let destPath = path.resolve(config.releaseDestDir, lang, './css/main.css');
        fse.ensureDirSync(path.dirname(destPath));
        fs.writeFileSync(destPath, result.css, 'utf8');
        console.log(chalk.green(`generated: ${destPath}`));
    }

    console.log('buildSASS done.');
}

async function getFolderHash(globPattern) {
    const files = await globby(globPattern.replace(/\\/g, '/'));
    if (!files.length) {
        throw new Error('No file exists for pattern ' + globPattern);
    }
    let concatedStr = '';
    for (let file of files) {
        const content = fs.readFileSync(file);
        concatedStr += md5(content);
    }
    assert(concatedStr);
    return md5(concatedStr).substr(-10);
}

async function buildJade(config) {
    const basePath = path.resolve(projectDir, '_jade');
    const srcPaths = await globby([
        '**/*.jade'
    ], {
        cwd: basePath
    });

    const spaPageConfigs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/spa-pages.json'), 'utf-8'));

    const hashes = {};
    for (let lang of ['zh', 'en']) {
        hashes[lang] = {
            docHash: await getFolderHash(path.resolve(config.releaseDestDir, lang, 'documents/**/*.js'))
        };
    }

    function prepareConfig(srcPath) {
        const lang = (srcPath.indexOf('zh/') === 0
            || srcPath.indexOf('examples/zh/') === 0) ? 'zh' : 'en';

        assert(hashes[lang]);

        const cfg = Object.assign({}, config, hashes[lang]);
        cfg.cdnPayRoot = config.cdnPayRootMap[lang];
        cfg.cdnFreeRoot = config.cdnFreeRootMap[lang];

        const pageCfg = spaPageConfigs.find(pageCfg => srcPath.endsWith(pageCfg.entry));
        if (pageCfg) {
            cfg.pageConfig = Object.assign({}, pageCfg, {
                // Because jade doesn't support dynamic include. we have to read HTML and insert it in jade manually.
                bodyHtml: fs.readFileSync(path.resolve(__dirname, `../_generated/spa/${pageCfg.pageName}/_body.html`), 'utf-8')
            });
        }
        else {
            // Avoid error
            cfg.pageConfig = {};
        }

        // This props can be read in jade tpl, like: `#{cdnPayRoot}`
        assert(
            cfg.cdnPayRoot
            && cfg.cdnFreeRoot
            && cfg.host
            && cfg.cdnThirdParty
            && cfg.galleryPath
            && cfg.releaseDestDir
            && cfg.homeVersion
            && cfg.cdnPayVersion
        );

        return cfg;
    }

    for (let srcPath of srcPaths) {
        const cfg = prepareConfig(srcPath);
        const filePath = path.resolve(basePath, srcPath);

        const destPath = path.resolve(cfg.releaseDestDir, srcPath.replace('.jade', '.html'));

        process.stdout.write(`generating: ${destPath} ...`);

        try {
            let compiledFunction = jade.compileFile(filePath);
            let html = compiledFunction(cfg);

            fse.ensureDirSync(path.dirname(destPath));
            fs.writeFileSync(destPath, html, 'utf8');

            console.log(chalk.green(` Done.`));
        }
        catch (err) {
            console.error(err.stack);
            console.error(err);
        }
    }

    console.log('buildJade done.');
}

async function buildJS(config) {
    const srcRelativePathList = await globby([
        'js/*.js',
        '!js/spreadsheet/**/*'
    ], {
        cwd: projectDir
    });
    for (let lang of LANGUAGES) {
        for (let srcRelativePath of srcRelativePathList) {
            let srcAbsolutePath = path.resolve(projectDir, srcRelativePath);
            let content = fs.readFileSync(srcAbsolutePath, 'utf8');

            let result = uglify.minify(content);
            if (result.error) {
                console.log(chalk.red(srcAbsolutePath));
                console.error(result.error);
                process.exit(1);
            }

            let destPath = path.resolve(config.releaseDestDir, lang, srcRelativePath);
            fse.ensureDirSync(path.dirname(destPath));
            fs.writeFileSync(destPath, result.code, 'utf8');

            console.log(chalk.green(`generated: ${destPath}`));
        }
    }

    console.log('buildJS done.');
}

async function copyResource(config) {

    async function doCopy(pattern, cwd) {
        const srcRelativePathList = await globby(pattern, {
            cwd
        });

        for (let lang of LANGUAGES) {
            for (let i = 0; i < srcRelativePathList.length; i++) {
                let srcRelativePath = srcRelativePathList[i];
                let srcAbsolutePath = path.resolve(cwd, srcRelativePath);
                let destAbsolutePath = path.resolve(config.releaseDestDir, lang, srcRelativePath);


                fse.ensureDirSync(path.dirname(destAbsolutePath));
                fs.copyFileSync(srcAbsolutePath, destAbsolutePath);

                replaceLog('(' + (i + 1) + '/' + srcRelativePathList.length + ') ' + chalk.green(`resource copied to: ${destAbsolutePath}`));
            }
        }
    }

    console.log();

    await doCopy([
        'vendors/**/*',
        'images/**/*',
        'asset/map/**/*',
        'asset/theme/**/*',
        'asset/lottie/**/*',
        'builder/**/*',
        'dist/**/*',
        'video/**/*'
    ], projectDir);

    await doCopy([
        '**/*',
        '!**/index.html',
    ], path.resolve(__dirname, '../_generated/spa/'))

    console.log('\ncopyResources done.');
}

async function updateSourceVersion(config) {
    for (let lang of LANGUAGES) {
        let filePath = path.resolve(config.releaseDestDir, lang, 'builder/echarts.html');
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/(urlArgs:\s*\'v=)([0-9rc\.-]+)\'/, '$1' + config.homeVersion + '\'');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(chalk.green(`sourceVersion updated: ${filePath}`));
    }
}

async function makeCDNChecker(config) {
    const relativePath = 'zh/css/only_for_cdn_ready_check.css';
    const targetPath = path.resolve(config.releaseDestDir, relativePath);
    const content = `/* ${config.homeVersion} OK */`;
    fs.writeFileSync(targetPath, content, 'utf8');
    const cdnPayRoot = config.cdnPayRootMap.zh;
    const homeVersion = config.homeVersion;

    console.log(chalk.green('================================================='));
    console.log(chalk.green('====== CDN checker =============================='));
    console.log(`Please waite for a while, and then use this shell cmd to check: `);
    console.log(chalk.green(`curl "${cdnPayRoot}/${relativePath}?_v_=${homeVersion}_test_1" | grep ${homeVersion}`));
    console.log(`If there is no ${chalk.green('OK')} printed, wait for a while and then use this cmd to check again:`);
    console.log(chalk.green(`curl "${cdnPayRoot}/${relativePath}?_v_=${homeVersion}_test_2" | grep ${homeVersion}`));
    console.log(`repeat this process until ${chalk.green('OK')} printed.`);
    console.log(chalk.green('================================================='));
}

async function buildLegacyDoc(config) {
    // Build JS
    let jsDestPathZH = path.resolve(config.releaseDestDir, './zh/js/docTool/main.js');
    let jsDestPathEN = path.resolve(config.releaseDestDir, './en/js/docTool/main.js');

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

    await new Promise((resolve, reject) => {
        requirejs.optimize(
            docToolConfig,
            function () {
                fse.ensureDirSync(path.dirname(jsDestPathEN));
                fse.copyFileSync(jsDestPathZH, jsDestPathEN);
                resolve();
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
    let cssDestPathZH = path.resolve(config.releaseDestDir, './zh/css/ecOption.css');
    fs.writeFileSync(cssDestPathZH, cssResult.css, 'utf8');
    let cssDestPathEN = path.resolve(config.releaseDestDir, './en/css/ecOption.css');
    fs.writeFileSync(cssDestPathEN, cssResult.css, 'utf8');

    // Copy css assets
    const assetDir = path.resolve(projectDir, 'legacy/css');
    const assetPaths = await globby(['**/*'], {cwd: assetDir});
    for (let assetPath of assetPaths) {
        let assetSrcPath = path.resolve(assetDir, assetPath);
        let assetDestPathZH = path.resolve(config.releaseDestDir, './zh/css', assetPath);
        let assetDestPathEN = path.resolve(config.releaseDestDir, './en/css', assetPath);
        fse.ensureDirSync(path.dirname(assetDestPathZH));
        fse.copyFileSync(assetSrcPath, assetDestPathZH);
        fse.ensureDirSync(path.dirname(assetDestPathEN));
        fse.copyFileSync(assetSrcPath, assetDestPathEN);
    }

    // Copy tpl.html
    let tplSrcPath = path.resolve(projectDir, 'legacy/js/docTool/main.tpl.html');
    let tplDestPathZH = path.resolve(config.releaseDestDir, './zh/js/docTool/main.tpl.html');
    let tplDestPathEN = path.resolve(config.releaseDestDir, './en/js/docTool/main.tpl.html');
    fse.ensureDirSync(path.dirname(tplDestPathZH));
    fse.copyFileSync(tplSrcPath, tplDestPathZH);
    fse.ensureDirSync(path.dirname(tplDestPathEN));
    fse.copyFileSync(tplSrcPath, tplDestPathEN);

    // Copy option3.json
    let option3SrcPath = path.resolve(projectDir, 'legacy/option3.json');
    let option3DestPath = path.resolve(config.releaseDestDir, './zh/documents/option3.json');
    fse.ensureDirSync(path.dirname(option3DestPath));
    fse.copyFileSync(option3SrcPath, option3DestPath);

    console.log('\nBuild legacy doc done.');
}

async function buildSpreadsheet(config) {
    // Build JS
    let jsDestPathZH = path.resolve(config.releaseDestDir, './zh/js/spreadsheet/spreadsheet.js');
    let jsDestPathEN = path.resolve(config.releaseDestDir, './en/js/spreadsheet/spreadsheet.js');

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
                resolve();
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
    let cssDestPathZH = path.resolve(config.releaseDestDir, './zh/css/spreadsheet.css');
    fs.writeFileSync(cssDestPathZH, cssResult.css, 'utf8');
    let cssDestPathEN = path.resolve(config.releaseDestDir, './en/css/spreadsheet.css');
    fs.writeFileSync(cssDestPathEN, cssResult.css, 'utf8');

    // Copy tpl.html
    let tplSrcPath = path.resolve(projectDir, 'js/spreadsheet/spreadsheet.tpl.html');
    let tplDestPathZH = path.resolve(config.releaseDestDir, './zh/js/spreadsheet/spreadsheet.tpl.html');
    let tplDestPathEN = path.resolve(config.releaseDestDir, './en/js/spreadsheet/spreadsheet.tpl.html');
    fse.ensureDirSync(path.dirname(tplDestPathZH));
    fse.copyFileSync(tplSrcPath, tplDestPathZH);
    fse.ensureDirSync(path.dirname(tplDestPathEN));
    fse.copyFileSync(tplSrcPath, tplDestPathEN);

    console.log('\nBuild spreadsheet done.');
}

function replaceLog(log) {
    if (process.stdout.clearLine) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(log);
    }
    else {
        console.log(log);
    }
}

async function run() {
    const config = initEnv();

    if (argv.clean) {
        await clean(config);
    }
    else {
        if (config.filter === 'all') {
            await buildSASS(config);
            await buildJS(config);
            await copyResource(config);
            await updateSourceVersion(config);

            await buildLegacyDoc(config);
            await buildSpreadsheet(config);

            // Build jade at last because it needs to read the resources.
            await buildJade(config);

            await makeCDNChecker(config);
        }
        else {
            const filters = config.filter.split(',');
            for (let i = 0; i < filters.length; ++i) {
                switch (filters[i]) {
                    case 'sass':
                        await buildSASS(config);
                        break;

                    case 'jade':
                        await buildJade(config);
                        break;

                    case 'js':
                        await buildJS(config);
                        break;

                    default:
                        console.warn('====================================================================');
                        console.warn('Filter is not supported: ' + filters[i]);
                        console.warn('Valid parameters of `--filter` includes sass, jade and js');
                        console.warn('E.g.: node build.js --env localsite --filter=sass,jade');
                        console.warn('====================================================================');
                }
            }
        }
    }

    console.log('All done.');
}

run();
