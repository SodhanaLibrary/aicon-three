var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

gulp.task('js', function(){
  return gulp.src('public/js/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(concat('dmars.min.js'))
    .pipe(gulp.dest('public/dist'))
});

gulp.task('default', [ 'js' ]);
