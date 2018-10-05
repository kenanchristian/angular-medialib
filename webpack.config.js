const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const { plugins } = require("./package.json")

module.exports = (env, argv) => {
  const dev = argv.mode !== "production"
  const entries = {
    "medialib": "./src/medialib/medialib.js"
  }

  for (const plugin of plugins) {
    entries[`plugins/medialib.${plugin.identifier}`] = [`./src/plugins/${plugin.identifier}/${plugin.identifier}.js`]
  }

  return {
    target: "web",
    devtool: dev ? "inline-source-map" : false,
    devServer: {
      contentBase: "./dist/"
    },
    entry: entries,
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].js"
    },
    module: {
      rules: [
        { test: /\.js$/, use: {
          loader: "babel-loader",
          query: {
            presets: ["env"],
            plugins: [
              ["babel-plugin-transform-builtin-extend", { globals: ["Array"], babelrc: false, approximate: true }]
            ]
          }
        }, exclude: /node_modules/ },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
        { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] },
        { test: /\.svg$/, loader: "svg-url-loader", options: { encoding: "base64" } }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" })
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({ exclude: /node_modules/ }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  }
}
