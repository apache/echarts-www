var gulp        = require('gulp');
var sass        = require('gulp-sass');
var less        = require('gulp-less');
var prefix      = require('gulp-autoprefixer');
var jade        = require('gulp-jade');
var clean       = require('gulp-clean');
var uglify      = require('gulp-uglify');
var copy        = require('gulp-copy');
var jade        = require('gulp-jade');
var fontmin     = require('gulp-fontmin');
var replace     = require('gulp-replace');
var config      = require('./config/env');

var requirejs = require('requirejs');

// Update home version each build.
config.homeVersion = +new Date();

/**
 * Build files for release
 */
gulp.task('build', function(){
    gulp.run('jade');
    gulp.run('sass');
});

/**
 * Compile files from _scss into css
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: function(e) {
                console.error(e);
            },
            outputStyle: 'compressed'
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('css'));
});

/**
 * Ye, I think it's reasonable that both use less and sass in this project.
 */
gulp.task('less', function () {
    // FIXME: where to put css, when using lots of vendor components including css.
    return gulp.src([
            'js/docTool/ecOption.less',
            'js/spreadsheet/spreadsheet.less'
        ])
        .pipe(less({
            paths: ['vendors'],
            onError: function(e) {
                console.error(e);
            },
            outputStyle: 'compressed'
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('css'));
});

/**
 * Update source code version
 */
gulp.task('sourceVersion', function () {
    // Replace version
    return gulp.src('builder/echarts.html')
        .pipe(replace(/(urlArgs:\s*\'v=)([0-9\.]+)\'/, '$1' + config.version + '\''))
        .pipe(gulp.dest('builder/'));
});
/**
 * Generate site using Jade
 */
gulp.task('jade', function() {
    return gulp.src('_jade/*.jade')
        .pipe(jade({
            data: config
        }))
        .pipe(gulp.dest('.'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files
 */
gulp.task('watch', ['sass', 'less', 'jade'], function() {
    gulp.watch('_scss/*.scss', ['sass']);
    gulp.watch([
        'js/docTool/ecOption.less',
        'js/spreadsheet/spreadsheet.less'
    ], ['less']);
    gulp.watch(['_jade/*', '_jade/components/*', '_jade/layouts/*'], ['jade']);
    // gulp.watch(['js/*'], ['js']);
});

/**
 * generate font file
 */
function minifyFont(text, cb) {
    gulp
        .src('_font/NotoSans*.ttf')
        .pipe(fontmin({
            text: text
        }))
        .pipe(gulp.dest('css/font'))
        .on('end', cb);
}

// gulp.task('fonts', ['jade'], function(cb) {

//     var buffers = [];

//     gulp
//         .src(['*.html', 'js/config.js', 'build/config.js'])
//         .on('data', function(file) {
//             buffers.push(file.contents);
//         })
//         .on('end', function() {
//             var text = Buffer.concat(buffers).toString('utf-8');
//             minifyFont(text, cb);
//         });

// });

/**
 * Default task, running just `gulp` will compile the sass.
 */
gulp.task('default', ['watch']);






// -------------------
// Release
// -------------------




gulp.task('release-docJS', ['release-clean'], function (taskReady) {
    requirejs.optimize(
        config.docToolConfig,
        function () {
            taskReady();
        },
        function (error) {
            console.error('requirejs task failed', error.message);
            process.exit(1);
        }
    );
});

gulp.task('release-spreadsheetJS', ['release-clean'], function (taskReady) {
    requirejs.optimize(
        config.spreadsheetConfig,
        function () {
            taskReady();
        },
        function (error) {
            console.error('requirejs task failed', error.message);
            process.exit(1);
        }
    );
});

gulp.task('release-otherJS', ['release-clean'], function () {
    return gulp.src(['js/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('release/js/'));
});

gulp.task('release-copy', ['sass', 'less', 'jade', 'release-clean'], function () {
    return gulp.src([
            './*.html', './vendors/**', './css/**', './documents/**', './blog/**',
            './js/docTool/*.html', './js/spreadsheet/*.html', './images/**', './asset/map/**', './asset/theme/**',
            './builder/**', './dist/**', './meeting/**', './share/**', './slides/**', './video/**',
            './config'
        ])
        .pipe(copy('release'));
});

gulp.task('release-clean', function() {
    return gulp.src(['./release'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('release', ['release-docJS', 'release-spreadsheetJS', 'release-otherJS', 'release-copy']);

gulp.task('release-doc-web', ['less'], function() {
    return gulp.src([
            './js/docTool/*', './vendors/dt/**', './images/**'
        ], {base: './'})
        .pipe(gulp.dest('../echarts-doc/public/cn'))
        .pipe(gulp.dest('../echarts-doc/public/en'));
});
