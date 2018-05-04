'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var lazypipe = require('lazypipe');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-clean-css');
var purgecss = require('gulp-purgecss');
var build = require('./build');
var path = require('path');
var rewrite = require('gulp-rewrite-css');

// merge with default parameters
var prod = false;
var i = process.argv.indexOf("--prod");
if(i>-1) {
    prod = !!process.argv[i+1];
}
var clean = false;
var i = process.argv.indexOf("--clean");
if(i>-1) {
    clean = !!process.argv[i+1];
}

if (clean !== false) {
  // force disable debug for production
  build.config.debug = false;
  build.config.compile.jsUglify = false;
  build.config.compile.cssMinify = true;
  build.config.compile.cssPurify = true;
} else if (prod !== false) {
  // force disable debug for production
  build.config.debug = false;
  build.config.compile.jsUglify = true;
  build.config.compile.cssMinify = true;
  build.config.compile.cssPurify = true;
}

module.exports = {

  // default variable config
  config: Object.assign({}, {
    debug: true,
    compile: {
      jsUglify: false,
      cssMinify: false,
      cssPurify: false
    },
  }, build.config),

  rootPath: './',

  /**
   * Walk into object recursively
   * @param array
   * @param funcname
   * @param userdata
   * @returns {boolean}
   */
  objectWalkRecursive: function(array, funcname, userdata) {
    if (!array || typeof array !== 'object') {
      return false;
    }
    if (typeof funcname !== 'function') {
      return false;
    }
    for (var key in array) {
      // apply "funcname" recursively only on object
      if (Object.prototype.toString.call(array[key]) === '[object Object]') {
        var funcArgs = [array[key], funcname];
        if (arguments.length > 2) {
          funcArgs.push(userdata);
        }
        if (module.exports.objectWalkRecursive.apply(null, funcArgs) === false) {
          return false;
        }
        // continue
      }
      try {
        if (arguments.length > 2) {
          funcname(array[key], key, userdata);
        } else {
          funcname(array[key], key);
        }
      } catch (e) {
        return false;
      }
    }
    return true;
  },

  /**
   * Add JS compilation options to gulp pipe
   */
  jsChannel: function() {
    var config = this.config.compile;
    return lazypipe().pipe(function() {
      return gulpif(config.jsUglify && !config.debug, uglify());
    });
  },

  /**
   * Add CSS compilation options to gulp pipe
   */
  cssChannel: function() {
    var config = this.config.compile;
    console.log("css channel");
    console.log(config);
    return lazypipe().pipe(function() {
      return gulpif(config.cssMinify, cleancss({debug: config.debug}));
    });
  },

  /**
   * Multiple output paths by output config
   * @param path
   * @param outputFile
   * @returns {*}
   */
  outputChannel: function(path, outputFile) {
    if (typeof outputFile === 'undefined') outputFile = '';
    var piping = lazypipe();
    console.log("outputing", path);
    var excludedFiles = [];
    var regex = new RegExp(/\{\$.*?\}/);
    var matched = path.match(regex);
    if (matched) {
      var output = build.config.dist;
      var outputPath = path.replace(matched[0], output).replace(outputFile, '');
      (function(_output) {
        piping = piping.pipe(function() {
          return gulp.dest(_output);
        });
      })(outputPath);
    }

    return piping;
  },

  /**
   * Convert string path to actual path
   * @param path
   * @returns {*}
   */
  dotPath: function(path) {
    var regex = new RegExp(/\{\$(.*?)\}/),
        dot = function(obj, i) {
          return obj[i];
        };
    var matched = path.match(regex);
    if (matched) {
      var realpath = matched[1].split('.').reduce(dot, build);
      return path = path.replace(matched[0], realpath);
    }

    return path;
  },

  /**
   * Convert multiple paths
   * @param paths
   */
  dotPaths: function(paths) {
    paths.forEach(function(path, i) {
      paths[i] = module.exports.dotPath(path);
    });
  },

  /**
   * Css path rewriter when bundle files moved
   * @param folder
   */
  cssRewriter: function(folder) {
    var imgRegex = new RegExp(/\.(gif|jpg|jpeg|tiff|png|ico)$/i);
    var fontRegex = new RegExp(/\.(otf|eot|svg|ttf|woff|woff2)$/i);
    var config = this.config;

    return lazypipe().pipe(function() {
      // rewrite css relative path
      return rewrite({
        destination: folder,
        debug: config.debug,
        adaptPath: function(ctx) {
          var isCss = ctx.sourceFile.match(/\.[css]+$/i);
          // process css only
          if (isCss[0] === '.css') {
            var pieces = ctx.sourceDir.split(/\\|\//);

            var vendor = pieces[pieces.indexOf('node_modules') + 1];
            if (pieces.indexOf('node_modules') === -1) {
              vendor = pieces[pieces.indexOf('vendors') + 1];
            }

            var file = module.exports.baseName(ctx.targetFile);

            var extension = 'fonts/';
            if (imgRegex.test(file)) {
              extension = 'images/';
            }

            return path.join(extension + vendor, file);
          }
        },
      });
    });
  },

  /**
   * Get end filename from path
   * @param path
   * @returns {string}
   */
  baseName: function(path) {
    var maybeFile = path.split('/').pop();
    if (maybeFile.indexOf('.') !== -1) {
      return maybeFile;
    }
    return '';
  },

  /**
   * Bundle
   * @param bundle
   */
  bundle: function(bundle) {
    var _self = this;
    var tasks = [];

    if (typeof bundle.src !== 'undefined' && typeof bundle.bundle !== 'undefined') {

      // for images & fonts as per vendor
      if ('mandatory' in bundle.src && 'optional' in bundle.src) {
        var vendors = {};

        for (var key in bundle.src) {
          if (!bundle.src.hasOwnProperty(key)) continue;
          vendors = Object.assign(vendors, bundle.src[key]);
        }

        for (var vendor in vendors) {
          if (!vendors.hasOwnProperty(vendor)) continue;

          var vendorObj = vendors[vendor];

          for (var type in vendorObj) {
            if (!vendorObj.hasOwnProperty(type)) continue;

            _self.dotPaths(vendorObj[type]);

            switch (type) {
              case 'fonts':
                gulp.src(vendorObj[type]).pipe(_self.outputChannel(bundle.bundle.fonts + '/' + vendor)());
                break;
              case 'images':
                gulp.src(vendorObj[type]).pipe(_self.outputChannel(bundle.bundle.images + '/' + vendor)());
                break;
            }
          }
        }
      }

      // flattening array
      if (!('styles' in bundle.src) && !('scripts' in bundle.src)) {
        var src = {styles: [], scripts: []};
        _self.objectWalkRecursive(bundle.src, function(paths, type) {
          switch (type) {
            case 'styles':
            case 'scripts':
              src[type] = src[type].concat(paths);
              break;
          }
        });
        bundle.src = src;
      }

      for (var type in bundle.src) {
        if (!bundle.src.hasOwnProperty(type)) continue;
        // skip if not array
        if (Object.prototype.toString.call(bundle.src[type]) !== '[object Array]') continue;
        // skip if no bundle output is provided
        if (typeof bundle.bundle[type] === 'undefined') continue;

        _self.dotPaths(bundle.src[type]);
        var outputFile = _self.baseName(bundle.bundle[type]);
        console.log("bundling");
        console.log(bundle.src);
        switch (type) {
          case 'styles':
            if (this.config.compile.cssPurify) {
              bundle.src.html && _self.dotPaths(bundle.src.html);
              bundle.src.scripts && _self.dotPaths(bundle.src.scripts);
            }
            gulp.src(bundle.src[type])
            .pipe(_self.cssRewriter(bundle.bundle[type])())
            .pipe(concat(outputFile))
            .pipe(_self.cssChannel()())
            .pipe(
              gulpif(this.config.compile.cssPurify && !!bundle.src.html,purgecss({
                content: bundle.src.html.concat(bundle.src.scripts)
              }))
            )
            .pipe(_self.outputChannel(bundle.bundle[type], outputFile)());
            break;

          case 'scripts':
            return gulp.src(bundle.src[type]).pipe(concat(outputFile)).pipe(_self.jsChannel()()).pipe(_self.outputChannel(bundle.bundle[type], outputFile)());
            break;
          default:
            break;
        }
      }
    }
    return tasks;
  },

  /**
   * Copy source to output destination
   * @param bundle
   */
  output: function(bundle) {
    var _self = this;

    if (typeof bundle.src !== 'undefined' && typeof bundle.output !== 'undefined') {
      for (var type in bundle.src) {
        if (!bundle.src.hasOwnProperty(type)) continue;

        _self.dotPaths(bundle.src[type]);

        switch (type) {
          case 'styles':
            if (this.config.compile.cssPurify) {
              bundle.src.html && _self.dotPaths(bundle.src.html);
              bundle.src.scripts && _self.dotPaths(bundle.src.scripts);
            }
            gulp.src(bundle.src[type])
            .pipe(_self.cssChannel()())
            .pipe(
              gulpif(this.config.compile.cssPurify && !!bundle.src.html,purgecss({
                content: bundle.src.html.concat(bundle.src.scripts)
              }))
            )
            .pipe(_self.outputChannel(bundle.output[type])());
            break;
          case 'scripts':
            gulp.src(bundle.src[type]).pipe(_self.jsChannel()()).pipe(_self.outputChannel(bundle.output[type])());
            break;
          default:
            gulp.src(bundle.src[type]).pipe(_self.outputChannel(bundle.output[type])());
            break;
        }
      }
    }
  }
};
