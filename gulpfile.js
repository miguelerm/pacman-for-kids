var gulp = require('gulp');
var concat = require('gulp-concat-util');
var compile = require('google-closure-compiler-js').gulp();
var replace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var del = require('del');

gulp.task('compile-game', function () {

    return gulp.src("./index.js")
    .pipe(concat.header('(function(){\n'))
    .pipe(concat.footer('})();'))
    .pipe(compile({
        //compilationLevel: "ADVANCED",
        jsOutputFile: 'compiled-game.js',
        externs: ["./node_modules/phaser/build/phaser.min.js"]
    }))
    .pipe(gulp.dest('dist'));

});

gulp.task('concatenate', ['compile-game'], function() {
    return gulp.src([
        './node_modules/phaser/build/phaser.min.js',
        './dist/compiled-game.js'
        ])
        .pipe(concat('game.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('min-html', function () {
    return gulp.src('./index.html')
            .pipe(replace({
                'game': 'js/game.js'
            }))
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets', function () {
    return gulp.src(['./assets/**/*']).pipe(gulp.dest('./dist/assets'));
});

gulp.task('default', ['concatenate', 'min-html', 'copy-assets'], function(cb) {
    del(['./dist/compiled-game.js'], cb);
});
