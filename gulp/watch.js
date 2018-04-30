var gulp = require('gulp');
var build = require('./build');

var htmlPath = build.config.path.src + '/popup.html'
var jsPath = build.config.path.src + '/js/*.js';
var cssPath = build.config.path.src + '/css/*.css'

gulp.task('watch', function () {
	gulp.watch([htmlPath, cssPath, jsPath], ['build-bundle']);
});

gulp.task('watch:css', function () {
	gulp.watch([htmlPath, cssPath], ['build-bundle']);
});

gulp.task('watch:js', function () {
	gulp.watch(jsPath, ['build-bundle']);
});
