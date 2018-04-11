import fs from "fs"
import gulp from "gulp"
import SVGO from "svgo"
import rollup from "gulp-rollup"
import rename from "gulp-rename"
import connect from "gulp-connect"
import scss from "postcss-scss"
import url from "postcss-url"
import nested from "postcss-nested"
import postcss from "gulp-postcss"
import concat from "gulp-concat"
import config from "./package.json"

gulp.task("js", () => {
  return gulp.src("./src/medialib/**/*.js")
    .pipe(rollup({ input: "./src/medialib/medialib.js", output: { format: "iife", name: "medialib" } }))
    .pipe(gulp.dest("./dist/"))
})

gulp.task("plugins", () => {
  for (const plugin of config.plugins) {
    gulp.src([`./src/plugins/${plugin.identifier}/**/*.js`, ...plugin.sources])
      .pipe(rollup({ input: `./src/plugins/${plugin.identifier}/${plugin.identifier}.js`, output: { format: "iife", name: `medialib_${plugin.identifier}` } }))
      .pipe(rename(`medialib.${plugin.identifier}.js`))
      .pipe(gulp.dest("./dist/plugins/"))
  }
})

gulp.task("css", () => {
  return gulp.src(["src/medialib/**/*.scss", "src/plugins/**/*.scss"])
    .pipe(postcss([url({ url: "inline" }), nested], { parser: scss }))
    .pipe(concat("medialib.css"))
    .pipe(gulp.dest("./dist/"))
    .pipe(connect.reload())
})

gulp.task("serve", () => {
  connect.server({
    port: 8888,
    host: "127.0.0.1",
    root: ".",
    livereload: true
  })
})

gulp.task("watch", () => {
  gulp.watch("./src/**/*.scss", ["css"])
})

gulp.task("icons", (callback) => {
  const svgo = new SVGO({ datauri: "base64", plugins: [
    { cleanupAttrs: true },
    { removeDoctype: true },
    { removeXMLProcInst: true },
    { removeComments: true },
    { removeMetadata: true },
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessDefs: true },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeHiddenElems: true },
    { removeEmptyText: true },
    { removeEmptyContainers: true },
    { removeViewBox: false },
    { cleanUpEnableBackground: true },
    { convertStyleToAttrs: true },
    { convertColors: true },
    { convertPathData: true },
    { convertTransform: true },
    { removeUnknownsAndDefaults: true },
    { removeNonInheritableGroupAttrs: true },
    { removeUselessStrokeAndFill: true },
    { removeUnusedNS: true },
    { cleanupIDs: true },
    { cleanupNumericValues: true },
    { moveElemsAttrsToGroup: true },
    { moveGroupAttrsToElems: true },
    { collapseGroups: true },
    { removeRasterImages: false },
    { mergePaths: true },
    { convertShapeToPath: true },
    { sortAttrs: true },
    { transformsWithOnePath: false },
    { removeDimensions: true }
  ] })
  Promise.all(fs.readdirSync("./src/icons/").map((file) => {
    const icon = file.replace(/\.svg$/, "")
    const contents = fs.readFileSync(`./src/icons/${file}`, { encoding: "utf8" })
    return svgo.optimize(contents).then(({ data }) => {
      return { icon, data }
    })
  })).then((items) => {
    const icons = {}
    for (const item of items) {
      icons[item.icon] = item.data
    }
    const script = `angular.module("medialib").constant("MedialibIcons", ${JSON.stringify(icons)})`
    fs.writeFileSync("./src/medialib/classes/Icons.js", script)
    callback()
  })
})

gulp.task("default", ["css", "serve", "watch"])
gulp.task("dist", ["js", "plugins", "css"])
