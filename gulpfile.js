var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var gulpUsing = require('gulp-using');


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

function js() {
	return gulp.src(jsPublicProductionFiles)
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/dist'));
}

function jsDebug() {
	return gulp.src(jsPublicFiles)
	.pipe(concat('app.min.js'))
	.pipe(gulp.dest('public/dist'));
}

function lintPublic() {
	return gulp.src(jsPublicProductionFiles)
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
}

function lintApp() {
	return gulp.src(jsAppFiles)
	.pipe(jshint({
		node: true,
		esversion: 8
	}))
	.pipe(jshint.reporter('jshint-stylish'))
}

function lintTest() {
	return gulp.src(jsTestFiles)
	.pipe(jshint({
		node: true,
		mocha: true,
		esversion: 6
	}))
	.pipe(jshint.reporter('jshint-stylish'));
}

var lint = gulp.series(lintPublic, lintApp, lintTest);

function using() {
	return gulp.src(jsAppFiles.concat(jsPublicProductionFiles))
	.pipe(gulpUsing());
}

function usingNoProd() {
	return gulp.src(jsAppFiles.concat(jsPublicFiles))
	.pipe(gulpUsing());
}

function justWatch() {
	gulp.watch(jsPublicFiles, js);
}

function justWatchDebug() {
	gulp.watch(jsPublicFiles, jsDebug);
}

var watch = gulp.series(js, justWatch);

var watchDebug = gulp.series(jsDebug, justWatchDebug);

gulp.task(js);
gulp.task(jsDebug);
gulp.task(lintPublic);
gulp.task(lintApp);
gulp.task(lintTest);
gulp.task('lint', lint);
gulp.task(using);
gulp.task(usingNoProd);
gulp.task('watch', watch);
gulp.task('watchDebug', watchDebug);
gulp.task('default', js);
