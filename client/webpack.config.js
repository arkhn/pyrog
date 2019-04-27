var path = require("path");
var htmlPlugin = require("html-webpack-plugin");
var FaviconsWebpackPlugin = require("favicons-webpack-plugin");
var Dotenv = require("dotenv-webpack");

var SRC_DIR = path.join(__dirname, "./src");
var DIST_DIR = path.join(__dirname, "./dist");

module.exports = (env, argv) => {
  return {
    // Indicates where to start so as to build the module dependency graph
    context: SRC_DIR,
    entry: "./app.tsx",
    // Where bundles should be emitted
    output: {
      path: DIST_DIR,
      filename: "fhirball.bundle.js"
    },
    // By default, webpack only handles js and json files.
    // In order to process other types of files, one should use
    // "loaders".
    module: {
      rules: [
        {
          test: /\.(tsx|ts)?$/,
          use: ["awesome-typescript-loader"]
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"]
        },
        {
          test: /\.svg$/,
          loader: "raw-loader"
        },
        {
          // This is, among others, for files present in ./node_modules/graphql
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader"
        }
      ]
    },
    // In this app, plugins are used to optimize emitted bundles and
    // set environment variables if need be.
    plugins: [
      new htmlPlugin({
        template: "index.html"
      }),
      new FaviconsWebpackPlugin({ logo: "./assets/img/logo.png" }),
      new Dotenv({
        path: argv.mode === "production" ? "../../.env" : "./.env.staging"
      })
    ],
    // Resolvers are used to locate modules using absolute paths.
    // This allows to write `import * from './module'` instead of
    // `import * from './module.tsx'`
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".json"]
    },
    // Run optimisation scripts depending on the `mode` (dev or prod).
    // webpack minimises the code by default on prod
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    devServer: {
      // Allows to handle routes with React instead of webpack
      historyApiFallback: true
    },
    // Prevents source map erros in development in Firefox
    devtool: "source-map"
  };
};
