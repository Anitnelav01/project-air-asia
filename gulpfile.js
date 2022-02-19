//Requires
const gulp = require("gulp");
var browsersync = require("browser-sync").create();
var clean = require("gulp-clean");
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass')(require('sass'));
var prefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var uglify = require('gulp-uglify');


//Paths
var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        images: 'build/images/',
        fonts: 'build/fonts/',
        icons: 'build/icons/',
        all: 'build/*'
    },
    src: {
        html: 'src/pages/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        images: 'src/static/images/*',
        fonts: 'src/static/fonts/*',
        icons: 'src/static/icons/*',
        all: 'src/*'
    },
};

//Server
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: path.build.html,
            host: "0.0.0.0",
            port: 3000,
        },
        notify: false,
    });

    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}

//Building html
function htmlBuild(done) {
    return gulp.src(path.src.html)
        //.pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browsersync.stream());
    done();
}

//Building CSS
function cssBuild(done) {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browsersync.stream());
    done();
}

//Building JS
function jsBuild(done) {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browsersync.stream());
    done();

}

//Building fonts
function fontsBuild(done) {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browsersync.stream());
    done();
}

//Building images
function imagesBuild(done) {
    return gulp.src(path.src.images)
        .pipe(gulp.dest(path.build.images))
        .pipe(browsersync.stream());
    done();
}

//Building icons
function iconsBuild(done) {
    return gulp.src(path.src.icons)
        .pipe(gulp.dest(path.build.icons))
        .pipe(browsersync.stream());
    done();
}

//Cleaning dist dir
function cleanDistDir() {
    return gulp.src(path.build.all, {read: false}).pipe(
        clean({
            allowEmpty: true,
        })
    );
}

//Watcher
function watchFiles() {
    // Html watching
    gulp.watch(
        [path.src.html],
        {ignoreInitial: false},
        htmlBuild
    );

    // Css watching
    gulp.watch(
        [path.src.style],
        {ignoreInitial: false},
        cssBuild
    );

    // Js watching
    gulp.watch(
        [path.src.js],
        {ignoreInitial: false},
        jsBuild
    );

    // Fonts watching
    gulp.watch(
        [path.src.fonts],
        {ignoreInitial: false},
        fontsBuild
    );

    // Fonts watching
    gulp.watch(
        [path.src.images],
        {ignoreInitial: false},
        imagesBuild
    );

    // Icons watching
    gulp.watch(
        [path.src.icons],
        {ignoreInitial: false},
        iconsBuild
    );

    // Browser sync.
    gulp.watch(path.src.all, {ignoreInitial: false}, browserSyncReload);
}


//Complex tasks
const build = gulp.series(cleanDistDir, gulp.parallel(htmlBuild, cssBuild, jsBuild, fontsBuild, imagesBuild, iconsBuild));
const dev = gulp.series(cleanDistDir, gulp.parallel(watchFiles, browserSync));

exports.build = build;
exports.watch = dev;

