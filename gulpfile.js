'use strict';
var gulp = require('gulp');

var browserSync = require('browser-sync');

var del = require('del'); 

// include gulp plug-ins
var serverLivereload = require('gulp-server-livereload');
var jshint = require('gulp-jshint');
var runSequence = require('gulp-run-sequence');
var sass = require('gulp-sass'); 
var uglify = require('gulp-uglify'); 
var concat = require('gulp-concat'); 
var rename = require('gulp-rename'); 
var image = require('gulp-image');



gulp.task('server-livereload', function() {
  gulp.src('build')
    .pipe(serverLivereload({
      livereload: true,
      directoryListing: false,
      open: true      
    }));
});

var frontendLibs = [
    'bower_components/fullpage.js/jquery.fullpage.min.js',    
    'bower_components/jquery/dist/jquery.js'
  
];  

var styleLibs = [
    'bower_components/fullpage.js/jquery.fullpage.css'
];

gulp.task('libs', function(){
    return gulp.src(frontendLibs)
    .pipe(gulp.dest('./build/scripts/libs'))
});

gulp.task('styleLibs', function(){
    return gulp.src(styleLibs)
    .pipe(gulp.dest('./build/styles'))
});

gulp.task('styles', function() {
  return gulp.src('app/styles/*.scss')
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(rename({suffix: '.min'}))
   .pipe(gulp.dest('build/styles'));  
});

gulp.task('scripts', function() {
   return gulp.src('app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./build/scripts'))
    .pipe(rename('scripts.min.js'))   
    .pipe(uglify()) 
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function() {
    gulp.watch('app/scripts/*.js', ['scripts']);
    gulp.watch('app/styles/*.scss', ['styles']);
    gulp.watch('app/*.html', ['html']);
});

gulp.task('image', function () {
  gulp.src('app/images/*')
    .pipe(image())
    .pipe(gulp.dest('build/images'));
});

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('default', function(cb) {
    runSequence('clean', ['html','scripts','styles', 'libs', 'styleLibs'], 'server-livereload', 'watch', cb);
});