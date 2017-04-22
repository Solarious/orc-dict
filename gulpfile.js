var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var jsPublicFiles = [
	'public/app.module.js',
	'public/app.config.js',
	'public/app.run.js',
	'public/main/*.js',
	'public/admin/*.js',
	'public/shared/*.js',
	'public/word/*.js',
	'public/editable/*.js',
];

var jsAppFiles = [
	'server.js',
	'app/*.js'
];

gulp.task('build-js', function() {
	return gulp.src(jsPublicFiles)
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/dist'));
});

gulp.task('lintPublic', function() {
	return gulp.src(jsPublicFiles)
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('lintApp', function() {
	return gulp.src(jsAppFiles)
	.pipe(jshint({
		node: true,
		esversion: 6
	}))
	.pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('lint', ['lintPublic', 'lintApp'], function() {});

gulp.task('watch', function() {
	gulp.watch(jsFiles, ['build-js']);
});

gulp.task('default', ['build-js'], function(){});
