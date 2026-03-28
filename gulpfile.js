// gulpfile.js - Gulp 4 Automation Workflow for TechVista
// Run: npm install && gulp (for watch) or gulp build (for production build)

'use strict';

const gulp        = require('gulp');
const sass        = require('gulp-sass')(require('sass'));
const cleanCSS    = require('gulp-clean-css');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const imagemin    = require('gulp-imagemin');
const webp        = require('gulp-webp');
const rename      = require('gulp-rename');
const sourcemaps  = require('gulp-sourcemaps');
const autoprefixer= require('gulp-autoprefixer');
const purgecss    = require('gulp-purgecss');
const htmlmin     = require('gulp-htmlmin');
const size        = require('gulp-size');
const newer       = require('gulp-newer');
const plumber     = require('gulp-plumber');
const notify      = require('gulp-notify');
const browserSync = require('browser-sync').create();

// ============================================================
// CONFIGURATION
// ============================================================
const config = {
    src: {
        css:    'css/**/*.css',
        js:     'js/**/*.js',
        html:   '*.html',
        images: 'images/**/*',
        fonts:  'fonts/**/*'
    },
    dest: {
        css:    'dist/css',
        js:     'dist/js',
        html:   'dist',
        images: 'dist/images',
        fonts:  'dist/fonts'
    }
};

// Error handler to prevent watch from stopping
function onError(err) {
    notify.onError({
        title:   'Gulp Error',
        message: '<%= error.message %>'
    })(err);
    this.emit('end');
}

// ============================================================
// TASK 1: CSS OPTIMIZATION
// Steps: Combine → PurgeCSS → Autoprefixer → Minify → Sourcemaps
// ============================================================
function cssTask() {
    return gulp.src(config.src.css)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())

        // Step 1a: Combine all CSS files into one
        .pipe(concat('styles.css'))

        // Step 1b: Remove unused CSS (PurgeCSS scans HTML for used classes)
        .pipe(purgecss({
            content: ['*.html'],
            safelist: {
                standard: [/^nav/, /^hero/, /^btn/, /^animate/, /open/, /active/, /animated/, /scrolled/],
                deep: [/^page-hero/],
                greedy: [/^filter/, /^faq/]
            }
        }))

        // Step 1c: Add vendor prefixes for cross-browser compatibility
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', '> 1%'],
            cascade: false
        }))

        // Step 1d: Minify CSS (removes comments, whitespace, optimizes values)
        .pipe(cleanCSS({
            level: {
                1: { specialComments: 0 },   // Remove all comments
                2: { restructureRules: true } // Restructure/merge rules
            }
        }))

        // Step 1e: Rename to .min.css
        .pipe(rename({ suffix: '.min' }))

        // Step 1f: Write sourcemaps
        .pipe(sourcemaps.write('./maps'))

        // Show file size in terminal
        .pipe(size({ showFiles: true, title: 'CSS' }))

        .pipe(gulp.dest(config.dest.css))
        .pipe(browserSync.stream());
}

// ============================================================
// TASK 2: JAVASCRIPT OPTIMIZATION
// Steps: Combine → Minify (uglify) → Sourcemaps
// ============================================================
function jsTask() {
    // Order matters for bundling
    const jsFiles = [
        'js/utils.js',
        'js/navbar.js',
        'js/counter.js',
        'js/animations.js',
        'js/filter.js',
        'js/form.js',
        'js/main.js'
    ];

    return gulp.src(jsFiles)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())

        // Step 2a: Concatenate all JS files into one bundle
        .pipe(concat('bundle.js'))

        // Step 2b: Minify JavaScript
        // - Removes whitespace, comments
        // - Shortens variable names (mangling)
        // - Removes dead code
        .pipe(uglify({
            compress: {
                drop_console: true,     // Remove console.log statements
                drop_debugger: true,    // Remove debugger statements
                dead_code: true,        // Remove unreachable code
                unused: true,           // Remove unused variables/functions
                passes: 2               // Run compression twice for better results
            },
            mangle: {
                toplevel: false         // Don't mangle top-level names (keep public API)
            },
            output: {
                comments: false         // Remove all comments
            }
        }))

        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(size({ showFiles: true, title: 'JS' }))

        .pipe(gulp.dest(config.dest.js))
        .pipe(browserSync.stream());
}

// ============================================================
// TASK 3: IMAGE OPTIMIZATION
// Steps: Skip unchanged → Compress → Convert to WebP
// ============================================================
function imagesTask() {
    return gulp.src(config.src.images)
        .pipe(plumber({ errorHandler: onError }))

        // Step 3a: Only process NEW or CHANGED images (performance)
        .pipe(newer(config.dest.images))

        // Step 3b: Compress images (lossless for PNG, lossy for JPG)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ 
                quality: 75,            // 75% quality - good balance
                progressive: true       // Progressive JPEG loading
            }),
            imagemin.optipng({ 
                optimizationLevel: 5    // Level 5 = good compression
            }),
            imagemin.svgo({
                plugins: [
                    { name: 'removeViewBox', active: false },
                    { name: 'cleanupIDs', active: false }
                ]
            })
        ], {
            verbose: true
        }))

        .pipe(size({ showFiles: true, title: 'Images' }))
        .pipe(gulp.dest(config.dest.images));
}

// Step 3c: Convert images to WebP format
function webpTask() {
    return gulp.src('images/**/*.{jpg,jpeg,png}')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(newer({ dest: config.dest.images, ext: '.webp' }))

        // Convert to WebP with quality settings
        .pipe(webp({
            quality: 75,        // 75% quality
            method: 6,          // Slowest (best) compression method
            lossless: false     // Lossy compression
        }))

        .pipe(size({ showFiles: true, title: 'WebP' }))
        .pipe(gulp.dest(config.dest.images));
}

// ============================================================
// TASK 4: HTML MINIFICATION
// ============================================================
function htmlTask() {
    return gulp.src(config.src.html)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(htmlmin({
            collapseWhitespace:    true,   // Remove whitespace
            removeComments:        true,   // Remove HTML comments
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS:             true,   // Minify inline CSS
            minifyJS:              true,   // Minify inline JS
            useShortDoctype:       true
        }))
        .pipe(size({ showFiles: true, title: 'HTML' }))
        .pipe(gulp.dest(config.dest.html));
}

// ============================================================
// TASK 5: COPY FONTS
// ============================================================
function fontsTask() {
    return gulp.src(config.src.fonts)
        .pipe(newer(config.dest.fonts))
        .pipe(size({ showFiles: true, title: 'Fonts' }))
        .pipe(gulp.dest(config.dest.fonts));
}

// ============================================================
// TASK 6: BROWSER SYNC (Dev Server)
// ============================================================
function serve(done) {
    browserSync.init({
        server: { baseDir: './' },
        port: 3000,
        notify: false,
        open: true
    });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

// ============================================================
// TASK 7: WATCH FILES FOR CHANGES
// ============================================================
function watchTask() {
    // Watch CSS - run cssTask and stream changes
    gulp.watch(config.src.css, cssTask);

    // Watch JS - run jsTask and reload
    gulp.watch(config.src.js, gulp.series(jsTask, reload));

    // Watch HTML - run htmlTask and reload
    gulp.watch(config.src.html, gulp.series(htmlTask, reload));

    // Watch images - recompress and reload
    gulp.watch(config.src.images, gulp.series(imagesTask, webpTask, reload));
}

// ============================================================
// EXPORT TASKS
// ============================================================

// Individual tasks
exports.css    = cssTask;
exports.js     = jsTask;
exports.images = imagesTask;
exports.webp   = webpTask;
exports.html   = htmlTask;
exports.fonts  = fontsTask;

// Build: Run all optimizations once
exports.build = gulp.series(
    gulp.parallel(cssTask, jsTask, htmlTask, fontsTask),
    gulp.parallel(imagesTask, webpTask)
);

// Default: Build then watch for changes (development mode)
exports.default = gulp.series(
    gulp.parallel(cssTask, jsTask, htmlTask),
    serve,
    watchTask
);

/*
=================================================================
HOW TO USE THIS GULPFILE
=================================================================

INSTALLATION:
  npm install --save-dev gulp gulp-sass sass gulp-clean-css 
    gulp-uglify gulp-concat gulp-imagemin@7 gulp-webp gulp-rename
    gulp-sourcemaps gulp-autoprefixer gulp-purgecss gulp-htmlmin
    gulp-size gulp-newer gulp-plumber gulp-notify browser-sync
    @11ty/eleventy

COMMANDS:
  gulp          → Build + start dev server + watch for changes
  gulp build    → One-time production build (all optimizations)
  gulp css      → Only process CSS files
  gulp js       → Only process JS files
  gulp images   → Only compress images
  gulp webp     → Only convert images to WebP

OUTPUT:
  All optimized files go to the /dist/ folder

WHAT EACH TASK DOES:
  CSS:    concat → purgecss → autoprefixer → minify → rename .min
  JS:     concat → uglify (mangle+compress) → rename .min
  Images: newer check → imagemin compress → webp convert
  HTML:   minify whitespace/comments/inline CSS+JS
  Fonts:  copy to dist
  Watch:  hot-reload CSS, full reload for JS/HTML/images
=================================================================
*/
