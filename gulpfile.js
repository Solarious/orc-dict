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

var jsPublicProductionFiles = jsPublicFiles.concat([
	'public/app.production.js'
]);

var jsAppFiles = [
	'server.js',
	'app/*.js'
];

gulp.task('js', function() {
	return gulp.src(jsPublicProductionFiles)
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/dist'));
});

gulp.task('js-debug', function() {
	return gulp.src(jsPublicFiles)
	.pipe(concat('app.min.js'))
	.pipe(gulp.dest('public/dist'));
});

gulp.task('lintPublic', function() {
	return gulp.src(jsPublicProductionFiles)
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

gulp.task('watch', ['js'], function() {
	gulp.watch(jsPublicFiles, ['js']);
});

gulp.task('watch-debug', ['js-debug'], function() {
	gulp.watch(jsPublicFiles, ['js-debug']);
});

gulp.task('default', ['js'], function(){});
