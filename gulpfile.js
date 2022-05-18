const { src, dest, series, parallel, watch } = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");

function ejsCompile(done) {
  src(["_dev/ejs/**/*.ejs", "!" + "_dev/ejs/inc/*.ejs"])
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("docs/"));
  done();
}

// ファイルの監視
function watchTask(done) {
  watch(["_dev/ejs/**/*.ejs"], ejsCompile);
  done();
}

exports.default = series(ejsCompile, watchTask);