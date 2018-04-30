var gulp = require('gulp');
var del = require('del');
var build = require('./build');
var func = require('./helpers');


gulp.task('clean', function() {
  return del([build.config.dist], {force: true});
});
