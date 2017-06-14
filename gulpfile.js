var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
if (process.env.NODE_ENV !== 'production') {
	var jshint = require('gulp-jshint');
	var using = require('gulp-using');
}

var jsPublicFiles = [
	'public/src/app.module.js',
	'public/src/**/*.js',
	'!public/src/app.production.js'
];

var jsPublicProductionFiles = [
	'public/src/app.module.js',
	'public/src/**/*.js'
];

var jsAppFiles = [
	'server.js',
	'app/**/*.js'
];

var jsTestFiles = [
	'test/**/*.js'
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

gulp.task('lintTest', function() {
	return gulp.src(jsTestFiles)
	.pipe(jshint({
		node: true,
		mocha: true,
		esversion: 6
	}))
	.pipe(jshint.reporter('jshint-stylish'));
})

gulp.task('using', function() {
	return gulp.src(jsAppFiles.concat(jsPublicProductionFiles))
	.pipe(using());
});

gulp.task('using-no-prod', function() {
	return gulp.src(jsAppFiles.concat(jsPublicFiles))
	.pipe(using());
});

gulp.task('lint', ['lintPublic', 'lintApp', 'lintTest'], function() {});

gulp.task('watch', ['js'], function() {
	gulp.watch(jsPublicFiles, ['js']);
});

gulp.task('watch-debug', ['js-debug'], function() {
	gulp.watch(jsPublicFiles, ['js-debug']);
});

gulp.task('default', ['js'], function(){});
