const path = require('path');
const fs = require('fs');
const { createServer } = require('vite');
const webpack = require('webpack');
const { info, error } = require('./stdout');

const port = 3000;
const host = '127.0.0.1';

const run = () => {
  const targetFilePath = path.join(__dirname, './src/plugins.tsx');
  const destFilePath = path.join(__dirname, './plugins.js');

  const compiler = webpack({
    entry: targetFilePath,
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2016',
            tsconfigRaw: require('../../../tsconfig.json'),
          },
          exclude: /nodu_module/,
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'esbuild-loader',
              options: {
                loader: 'css',
                minify: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'plugins.js',
      path: path.resolve(__dirname),
    },
  });

  compiler.run((err, stats) => {
    err && error(`[RUNNING COMPILER ERROR] ${err}`);
    stats && info(`[RUNNING COMPILER INFO] ${stats}`);

    createServer({
      configFile: false,
      root: __dirname,
      host,
      server: { port },
    }).then((server) => {
      server.listen().then(() => {
        server.printUrls();
        info('Press Ctrl+c if you want to close the server.');
      });
    });
    compiler.close((err, result) => {
      err && error(`[CLOSING COMPILER ERROR] ${err}`);
      result && info(`[CLOSING COMPILER INFO] ${result}`);

      process.on('SIGINT', () => {
        const licenseTxtFilePath = destFilePath + '.LICENSE.txt';
        if (fs.existsSync(destFilePath)) {
          try {
            fs.unlinkSync(destFilePath);
            info('Delete the file transpiled.');
          } catch (e) {
            error(e);
            process.exit(1);
          } finally {
            info('Server is stopped.');
          }
        } else if (fs.existsSync(licenseTxtFilePath)) {
          fs.unlinkSync(licenseTxtFilePath);
          info('Delete the file named LICENSE.txt');
        } else {
          process.exit(0);
        }
      });
    });
  });
};

module.exports = {
  run,
};
