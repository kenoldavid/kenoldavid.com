const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const autoprefixer = require("autoprefixer");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//! Purifycss or Purgecss plugin for webpack - Your choice!
const PurifyCSSPlugin = require("purifycss-webpack");
// const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, "src"),
  dist: path.resolve(__dirname, "octobercms/themes/legba/assets/dist"),
  layouts: path.join(__dirname, "octobercms/themes/legba/layouts"),
  partials: path.join(__dirname, "octobercms/themes/legba/partials"),
};

module.exports = env => {
  // Use env.<YOUR VARIABLE> here:

  const isProduction = env.production === true;

  // console.log("NODE_ENV: ", env.NODE_ENV); // 'local'
  // console.log("Production: ", isProduction); // true
  // console.log("env: ", env);

  const bootstrapEntryPoint = isProduction
    ? `bootstrap-loader/lib/bootstrap.loader?extractStyles&configFilePath=${__dirname}/bs4-prod.yml!bootstrap-loader/no-op.js`
    : `bootstrap-loader/lib/bootstrap.loader?configFilePath=${__dirname}/bs4-dev.yml!bootstrap-loader/no-op.js`;
  // console.log("bootstrapEntryPoint is: ", bootstrapEntryPoint);

  const cssDev = [
    {
      loader: "style-loader" // Injects CSS to page
    },
    {
      /*  Translates CSS into CommonJS modules
          Interprets `@import` and `url()` like `import/require()` and will resolve them */
      loader: "css-loader"
    },
    {
      loader: "postcss-loader", // Loader for webpack to process CSS with PostCSS
      options: {
        plugins: function() {
          return [require("precss"), require("autoprefixer")];
        }
      }
    },
    {
      loader: "sass-loader" // Loads a SASS/SCSS file and compiles it to CSS
    }
  ];

  const cssProd = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      /*  Translates CSS into CommonJS modules. 
          Interprets `@import` and `url()` like `import/require()` and will resolve them */
      loader: "css-loader"
    },
    {
      loader: "postcss-loader", // Loader for webpack to process CSS with PostCSS
      options: {
        plugins: function() {
          return [autoprefixer];
        }
      }
    },
    {
      loader: "sass-loader" // Loads a SASS/SCSS file and compiles it to CSS
    }
  ];

  const cssConfig = isProduction ? cssProd : cssDev;
  // console.log("cssConfig: ", cssConfig);

  const jsAssets = [
    "./src/js/main.js",
    "./src/js/menu.js"
    // "./src/js/menuBtn"
    // "./src/js/bootstrap.js"
  ];

  return {
    //! Chosen mode tells webpack to use its built-in optimizations accordingly.
    mode: isProduction ? "production" : "development",

    //!----------------------------------------------------------------------------
    //! ENTRY ==> Here the application starts executing and webpack starts bundling
    //!----------------------------------------------------------------------------
    entry: {
      // main: "./src/js/main.js",
      bootstrap: [bootstrapEntryPoint].concat(jsAssets)
      // print: "./src/js/print.js"
    },

    //!-------------------------------------------------------
    //! OUPUT ==> Options related to how webpack emits results
    //!-------------------------------------------------------
    output: {
      /* The target directory for all output files. Must be an absolute path (use the Node.js path module). */
      // path: path.resolve(__dirname, "octobercms/themes/legba/assets/dist"),
      path: PATHS.dist,

      /* The filename template for entry chunks setup for multiple entry points. */
      filename: "js/[name].bundle.js",

      publicPath: "./themes/legba/assets/dist/",  // Not working with devServer
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true
          }
        }
      }
    },

    /*  This option controls if and how source maps are generated.   
        In order to make it easier to track down errors and warnings JavaScript offers source maps, which maps your compiled code back to your original source code. */
    devtool: "inline-source-map",

    /*  This option provides a simple web server and the ability to use live reloading 
        This tells webpack-dev-server to serve the files from the "public" directory on localhost:8080 */
    devServer: {
      contentBase: PATHS.dist,
      // contentBase: "octobercms/themes/legba/assets/dist",
      // publicPath: "/assets/",/* BUG?!!! */
      port: 8080,
      open: false,
      compress: true /* Enabling gzip compression for everything served */,
      hot: true /* Enabling HMR */,
      stats: "errors-only" /* Showing only errors in the bundle */,
      https: false,
      historyApiFallback: false,
      watchContentBase: true
    },

    //!-------------------------------------------------------
    //! MODULE
    //!-------------------------------------------------------
    module: {
      rules: [
        {
          //* Compile Sass files and Load CSS
          test: /\.scss$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, "src/scss"),
          use: cssConfig
        },
        {
          //* Load CSS
          test: /\.css$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, "src/css"),
          use: ["style-loader", "css-loader" /* , "postcss-loader" */]
        },
        {
          //* Load Images
          test: /\.(svg|png|jpe?g|gif|webp)$/i,
          exclude: /node_modules/,
          include: path.resolve(__dirname, "src/images"),
          use: [
            {
              loader: "file-loader",
              options: {
                // name: "[hash:6].[ext]",
                name: "[name].[ext]",
                outputPath: "images/",
                publicPath: isProduction ? "../images/" : "./themes/legba/assets/dist/images/"
              }
            }
          ]
        },
        {
          //* Load Fonts (SVG - due to some svg font types)
          test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/",
                publicPath: isProduction ? "../fonts/" : "./themes/legba/assets/dist/fonts/"
              }
            }
          ]
        },
        {
          //* Bootstrap 4
          test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/,
          loader: "imports-loader?jQuery=jquery"
        },
        {
          //* Webpack loader for compiling Twig.js templates.
          test: /\.twig$/,
          loader: "twig-loader",
          options: {
            // See options section below
          }
        }
      ]
    }, //! end "module"

    //!-------------------------------------------------------
    //! PLUGINS
    //!-------------------------------------------------------
    plugins: [
      /* This plugin cleans the /public (output) folder before each build, so that only used files will be generated. */
      new CleanWebpackPlugin([
        `${PATHS.dist}`,
        `${PATHS.layouts}/*.*`,
      ]),
      // new CleanWebpackPlugin([`${PATHS.dist}`]),

      /*  This plugin creates HTML files to serve the webpack bundles 
          TODO - Take a look at html-webpack-template
      */
      new HtmlWebpackPlugin({
        title: "Welcome To My Portfolio",
        minify: {
          // collapseWhitespace: isProduction ? true : false
        },
        hash: true,
        template: `${PATHS.src}/layouts/default.twig.js`, // Load a custom template
        filename: `${PATHS.layouts}/default.htm` // Generating an output file
        // excludeChunks: ["bootstrap"]
      }),
      
      // new HtmlWebpackPlugin({
      //   title: "About Me",
      //   minify: {
      //     // collapseWhitespace: isProduction ? true : false
      //   },
      //   hash: true,
      //   template: `${PATHS.src}/layouts/home.twig.js`, // Load a custom template
      //   filename: `${PATHS.layouts}/about.htm` // Generating an output file
      //   // excludeChunks: ["bootstrap"]
      // }),

      // new HtmlWebpackPlugin({
      //   title: "Bootstrap Page",
      //   minify: {
      //     collapseWhitespace: isProduction ? true : false
      //   },
      //   hash: true,
      //   template: "src/bootstrap.html",
      //   filename: "bootstrap.html"
      //   // chunks: ["bootstrap"]
      // }),

      // new HtmlWebpackPlugin({
      //   title: "About Me - Kenol David",
      //   minify: {
      //     collapseWhitespace: isProduction ? true : false
      //   },
      //   hash: true,
      //   template: "src/about.html",
      //   filename: "about.html"
      //   // chunks: ["bootstrap"]
      // }),

      // new HtmlWebpackPlugin({
      //   title: "Contact Me - Kenol David",
      //   minify: {
      //     collapseWhitespace: isProduction ? true : false
      //   },
      //   hash: true,
      //   template: "src/contact.html",
      //   filename: "contact.html"
      //   // chunks: ["bootstrap"]
      // }),

      /* This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps. */
      new MiniCssExtractPlugin({
        // filename: "../../themes/legba/assets/dist/css/[name].bundle.css"
        filename: "css/[name].bundle.css"
      }),

      /* This plugin uses PurifyCSS to remove unused selectors from your CSS. */
      new PurifyCSSPlugin({
        // Give paths to parse for rules. These should be absolute!
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
      }),

      /* This plugin uses Purgecss to remove unused selectors from your CSS. */
      /* new PurgecssPlugin({
        paths: glob.sync(`${PATHS.src}/*.html`,  { nodir: true }),
      }), */

      /* This plugin allows all kinds of modules to be updated at runtime without the need for a full refresh. */
      new webpack.HotModuleReplacementPlugin(),

      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Tether: "tether",
        "window.Tether": "tether",
        Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
        Alert: "exports?Alert!bootstrap/js/dist/alert",
        Button: "exports?Button!bootstrap/js/dist/button",
        Carousel: "exports?Carousel!bootstrap/js/dist/carousel",
        Collapse: "exports?Collapse!bootstrap/js/dist/collapse",
        Dropdown: "exports?Dropdown!bootstrap/js/dist/dropdown",
        Modal: "exports?Modal!bootstrap/js/dist/modal",
        Popover: "exports?Popover!bootstrap/js/dist/popover",
        Scrollspy: "exports?Scrollspy!bootstrap/js/dist/scrollspy",
        Tab: "exports?Tab!bootstrap/js/dist/tab",
        Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
        Util: "exports?Util!bootstrap/js/dist/util"
      })
    ] //! end "plugins"
  }; //! end return
}; //! end "module.exports"
