const { src, dest, series, gulp, watch } = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');

const ejsCompile = (done) => {
  src(['_dev/ejs/**/*.ejs', '!' + '_dev/ejs/inc/*.ejs'])
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('docs/'));
  done();
};

/**
 * ローカルサーバー立ち上げ
 */
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};

const browserSyncOption = {
  server: './docs/',
};

/**
 * リロード
 */
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// ファイルの監視
function watchTask(done) {
  watch(['_dev/ejs/**/*.ejs'], ejsCompile);
  watch(['_dev/ejs/**/*.ejs', '_dev/scss/**/*.scss', '_dev/js/**/*.js'], browserSyncReload);
  done();
}

exports.default = series(ejsCompile, watchTask, browserSyncFunc);
