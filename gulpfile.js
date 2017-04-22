var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var jsFiles = [
	'public/app.module.js',
	'public/app.config.js',
	'public/app.run.js',
	'public/main/*.js',
	'public/admin/*.js',
	'public/shared/*.js',
	'public/word/*.js',
	'public/editable/*.js',
];

gulp.task('build-js', function() {
	return gulp.src(jsFiles)
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/dist'));
});

gulp.task('lint', function() {
	return gulp.src(jsFiles)
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('watch', function() {
	gulp.watch(jsFiles, ['build-js']);
});

gulp.task('default', ['build-js'], function(){});
