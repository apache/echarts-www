var gulp = require('gulp');
var sass = require('gulp-sass');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var jade = require('gulp-jade');
// var fontmin = require('gulp-fontmin');
var replace = require('gulp-replace');
var requirejs = require('requirejs');
var argv = require('yargs').argv;
var path = require('path');
var fse = require('fs-extra');
var eventStream = require('event-stream');

/**
 * ------------------------------------------------------------------------
 * Usage:
 *
 * ```shell
 * ./node_modules/.bin/gulp release --env asf
 * ./node_modules/.bin/gulp release --env echartsjs
 * ./node_modules/.bin/gulp release --env dev # the same as "debug"
 * # Check `./config` to see the available env
 *
 * ./nodule_modules/.bin/gulp sourceVersion
 * ```
 * ------------------------------------------------------------------------
 */

function initEnv() {
    var envType = argv.env;
    var isDev = argv.dev != null || argv.debug != null || envType === 'debug' || envType === 'dev';
    var notNeedEnv = (argv._ || [])[0] === 'sourceVersion';

    if (isDev) {
        console.warn('====================================================================');
        console.warn('THIS IS IN DEV MODE');
        console.warn('!!! Please input your local host in `config/env.dev.js` firstly !!!');
        console.warn('====================================================================');
        envType = 'dev';
    }
    if (notNeedEnv) {
        envType = 'asf';
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

    return config;
}

const config = initEnv();
const TEMP_RELEASE_DIR = 'release';

config.downloadVersion = '4.6.0';

// Update home version each build.
config.homeVersion = +new Date();

/**
 * Build files for release
 */
gulp.task('build', function () {
    gulp.run('jade');
    gulp.run('sass');
    gulp.run('less');
});

/**
 * Compile files from _scss into css
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: function (e) {
                console.error(e);
            },
            outputStyle: 'compressed'
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'zh/css')))
        .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'en/css')));
});
/**
 * Ye, I think it's reasonable that both use less and sass in this project.
 */
gulp.task('less', function () {
    // FIXME: where to put css, when using lots of vendor components including css.
    return gulp.src([
            'legacy/js/docTool/ecOption.less',
            'legacy/js/spreadsheet/spreadsheet.less'
        ])
        .pipe(less({
            paths: ['vendors'],
            onError: function (e) {
                console.error(e);
            },
            outputStyle: 'compressed'
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'zh/css')))
        .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'en/css')));
});
/**
 * Update source code version
 */
gulp.task('sourceVersion', function () {
    // Replace version
    return gulp.src('builder/echarts.html')
        // .pipe(replace(/(urlArgs:\s*\'v=)([0-9rc\.-]+)\'/, '$1' + config.version + '\''))
        .pipe(replace(/(urlArgs:\s*\'v=)([0-9rc\.-]+)\'/, '$1' + config.homeVersion + '\''))
        .pipe(gulp.dest('builder/'));
});

/**
 * Generate site using Jade
 */
gulp.task('jade', function () {
    return gulp.src('_jade/**/*.jade')
        .pipe(jade({
            data: config
        }))
        .pipe(gulp.dest(TEMP_RELEASE_DIR));
});

// -------------------
// Release
// -------------------


gulp.task('release-clean', function () {
    return gulp.src([
        // Remove all files in sub folder and html files in the roo
        path.join(config.releaseDestDir, '*/*'),
        path.join(config.releaseDestDir, '*.html')
        // keep .gitignore .htaccess README.md
    ], {
        read: false
    }).pipe(clean({
        force: true
    }));
});

gulp.task('release-spreadsheetJS', function (taskReady) {
    requirejs.optimize(
        config.spreadsheetConfig,
        function () {
            fse.ensureDirSync('release/en/js/spreadsheet/');
            fse.copyFileSync(
                'release/zh/js/spreadsheet/spreadsheet.js',
                'release/en/js/spreadsheet/spreadsheet.js',
            );
            taskReady();
        },
        function (error) {
            console.error('requirejs task failed', error.message);
            process.exit(1);
        }
    );
});

// DEPRECATED Remove this when option3.html is not support ASAP.
gulp.task('release-docJS-old', function (taskReady) {
    requirejs.optimize(
        config.docToolConfig,
        function () {
            fse.ensureDirSync('release/en/js/docTool/');
            fse.copyFileSync(
                'release/zh/js/docTool/main.js',
                'release/en/js/docTool/main.js',
            );
            taskReady();
        },
        function (error) {
            console.error('requirejs task failed', error.message);
            process.exit(1);
        }
    );

});

gulp.task('release-otherJS', function () {
    return gulp.src(['js/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'zh/js')))
        .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'en/js')));
});

gulp.task('release-js', ['release-spreadsheetJS', 'release-docJS-old', 'release-otherJS']);

gulp.task('copy', ['sass', 'less', 'jade', 'release-js', 'release-clean'], function () {
    ['vendors', 'images', 'js/spreadsheet', 'asset/map', 'asset/theme', 'builder', 'dist', 'video', 'config'].forEach(function (folder) {
        fse.ensureDirSync(path.join(TEMP_RELEASE_DIR, 'zh', folder));
        fse.ensureDirSync(path.join(TEMP_RELEASE_DIR, 'en', folder));
    });

    let patterns = [
        'vendors/**/*',
        'images/**/*',
        'js/spreadsheet/*.tpl.html',
        'asset/map/**/*', 'asset/theme/**/*',
        'builder/**/*',
        'dist/**/*', 'video/**/*',
        'config/**/*'
    ];

    return eventStream.merge([
        gulp.src(patterns)
            .pipe(copy(path.join(TEMP_RELEASE_DIR, 'zh'))),
        gulp.src(patterns)
            .pipe(copy(path.join(TEMP_RELEASE_DIR, 'en'))),

        // Move legacy option3.json
        gulp.src(['legacy/option3.json'])
            .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'zh/documents/'))),
        // Move legacy css fonts
        gulp.src(['legacy/css/font/*'])
            .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'zh/css/font/'))),
        gulp.src(['legacy/js/docTool/*.tpl.html'])
            .pipe(gulp.dest(path.join(TEMP_RELEASE_DIR, 'zh/js/docTool/')))
    ]);
});

// gulp.task('copy-resources', function () {
//     return gulp.src([
//         './blog/**',
//         './meeting/**', './share/**', './slides/**'
//     ]).pipe(gulp.dest(TEMP_RELEASE_DIR));
// });

gulp.task('release', ['copy', 'release-clean'], function () {
    gulp.src(path.join(TEMP_RELEASE_DIR, '**/*'))
        .pipe(gulp.dest(config.releaseDestDir));
});

