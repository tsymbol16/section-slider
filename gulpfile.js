const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('sass');
const gulpSass = require('gulp-sass');
const scss = gulpSass(sass);
const prettyHtml = require('gulp-pretty-html');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const concat = require('gulp-concat');



// developer options
const isSync = (process.argv.indexOf('--sync') !== -1);
const isMinHtml = (process.argv.indexOf('--mh') !== -1);
const isCleanCss = (process.argv.indexOf('--cc') !== -1);
const isSoMap = (process.argv.indexOf('--sm') !== -1);
const isGroupQuery = (process.argv.indexOf('--gq') !== -1);

// function delete all files from [dist] folder




function js(){
	return gulp.src('./src/js/**/*.js')
		.pipe(gulp.dest('./build/js/'))
		.pipe(gulpif(isSync, browserSync.stream()));
}
function img(){
	return gulp.src('./src/img/**/*')
		.pipe(gulp.dest('./build/img'))
}
function fonts(){
	return gulp.src('./src/fonts/**/*')
		.pipe(gulp.dest('./build/fonts/'))
}
function html(){
	return gulp.src('./src/index.pug')
		.pipe(pug({
   		// Your options in here.
  			}))
		.pipe(gulpif(isMinHtml,prettyHtml()))
		.pipe(gulp.dest('./build/'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

function styles() {
	return gulp.src('./src/css/**/*.scss')
		.pipe(scss().on('error', scss.logError))
		.pipe(gulpif(isGroupQuery, gcmq()))
		.pipe(gulp.dest('./build/css/'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

// watcher
function watch(){
	if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./build/",
	        },
	         tunnel: false,
	        //  tunnel: "pekur"
	    });
	}
	


	gulp.watch('./src/img/**/*', img);
	gulp.watch('./src/*.pug', html);
	gulp.watch('./src/js/**/*.js',js)
	gulp.watch('./src/css/**/*.scss',styles);
	
}


let build = gulp.series( 
	gulp.parallel(styles, img, html,fonts, js)
);

//  gulp tasks
gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));