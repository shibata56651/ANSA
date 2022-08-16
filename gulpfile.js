const { src, dest, series, gulp, watch } = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');

function ejsCompile(done) {
  src(["_dev/ejs/**/*.ejs", "!" + "_dev/ejs/inc/*.ejs"])
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("docs/"));
  done();
}

function imageMin() {
  gulp.src('./_dev-renew/imagemin/**/*')
  .pipe(imagemin([
    imagemin.gifsicle({ interlaced: true }),
    imagemin.mozjpeg({ quality: 75, progressive: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    // imagemin.svgo({
    //     plugins: [
    //         {removeViewBox: true},
    //         {cleanupIDs: false}
    //     ]
    // })
  ]))
  .pipe(gulp.dest('./positive/'))
}

// ファイルの監視
function watchTask(done) {
  watch(["_dev/ejs/**/*.ejs"], ejsCompile);
  done();
}

exports.default = series(ejsCompile, watchTask, imageMin);