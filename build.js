const fs = require('fs');
const fse = require('fs-extra');
const sass = require('node-sass');
// const less = require('less');
const globby = require('globby');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const jade = require('jade');
const path = require('path');
const uglify = require('uglify-js');
const argv = require('yargs').argv;
const assert = require('assert');

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

// gulp.task('copy', ['sass', 'less', 'jade', 'release-js', 'release-clean'], function () {
//     ['vendors', 'images', 'js/spreadsheet', 'asset/map', 'asset/theme', 'builder', 'dist', 'video', 'config'].forEach(function (folder) {
//         fse.ensureDirSync(path.join(TEMP_RELEASE_DIR, 'zh', folder));
//         fse.ensureDirSync(path.join(TEMP_RELEASE_DIR, 'en', folder));
//     });

//     let patterns = [
//         'vendors/**/*',
//         'images/**/*',
//         'js/spreadsheet/*.tpl.html',
//         'asset/map/**/*', 'asset/theme/**/*',
//         'builder/**/*',
//         'dist/**/*', 'video/**/*',
//         'config/**/*'
//     ];

//     return eventStream.merge([
//         gulp.src(patterns)
//             .pipe(copy(path.join(TEMP_RELEASE_DIR, 'zh'))),
//         gulp.src(patterns)
//             .pipe(copy(path.join(TEMP_RELEASE_DIR, 'en')))
//     ]);
// });

async function copyResource(config) {
    const srcRelativePathList = await globby([
        'vendors/**/*',
        'images/**/*',
        'js/spreadsheet/*.tpl.html',
        'asset/map/**/*',
        'asset/theme/**/*',
        'builder/**/*',
        'dist/**/*',
        'video/**/*',
        'config/**/*'
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


// gulp.task('less', function () {
//     // FIXME: where to put css, when using lots of vendor components including css.
//     return gulp.src([
//             'js/docTool/ecOption.less',
//             'js/spreadsheet/spreadsheet.less'
//         ])
//         .pipe(less({
//             paths: ['vendors'],
//             onError: function (e) {
//                 console.error(e);
//             },
//             outputStyle: 'compressed'
//         }))
//         .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
//             cascade: true
//         }))
//         .pipe(gulp.dest('css'));
// });
// gulp.task('release-spreadsheetJS', function (taskReady) {
//     requirejs.optimize(
//         config.spreadsheetConfig,
//         function () {
//             fse.ensureDirSync('release/en/js/spreadsheet/');
//             fse.copyFileSync(
//                 'release/zh/js/spreadsheet/spreadsheet.js',
//                 'release/en/js/spreadsheet/spreadsheet.js',
//             );
//             taskReady();
//         },
//         function (error) {
//             console.error('requirejs task failed', error.message);
//             process.exit(1);
//         }
//     );
// });


async function run() {
    const config = initEnv();

    await releaseClean(config);
    await buildSASS(config);
    await buildJade(config);
    await buildJS(config);
    await copyResource(config);
    await updateSourceVersion(config);

    console.log('All done.');
}

run();
