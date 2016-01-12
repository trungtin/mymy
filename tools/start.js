import browserSync from 'browser-sync';
import webpack from 'webpack';
import hygienistMiddleware from 'hygienist-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

global.watch = true;
const webpackConfig = require('./webpack.config')[0];
const bundler = webpack(webpackConfig);

export default async () => {
  await require('./build')();

  browserSync({
    server: {
      baseDir: 'build',

      middleware: [
        function allowCrossDomain(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          next();
        },
        hygienistMiddleware('build'),

        webpackDevMiddleware(bundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: webpackConfig.output.publicPath,

          // pretty colored output
          stats: webpackConfig.stats,

          // for other settings see
          // http://webpack.github.io/docs/webpack-dev-middleware.html
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }),

        // bundler should be the same as above
        webpackHotMiddleware(bundler),
      ],
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      'build/**/*.css',
      'build/**/*.html',
    ],
  });
};
