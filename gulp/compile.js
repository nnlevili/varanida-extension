var gulp = require('gulp');
var sequence = require('run-sequence');
var build = require('./build');
var func = require('./helpers');

build.config.compile = {
  'jsUglify': true,
  'cssMinify': true
};

// task to bundle js/css
gulp.task('build-bundle', function(cb) {
  func.objectWalkRecursive(build.build, function(val, key) {
    if (typeof val.src !== 'undefined') {
      if (typeof val.bundle !== 'undefined') {
        func.bundle(val);
      }
      if (typeof val.output !== 'undefined') {
        func.output(val);
      }
    }
  });
  cb();
});

// entry point
gulp.task('default', ['clean'], function(cb) {
  // clean first and then start bundling
  return sequence(['build-bundle'], cb);
});
