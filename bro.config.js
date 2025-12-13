const pkg = require("./package");
const path = require("path");

module.exports = {
  apiPath: "stubs/api",
  webpackConfig: {
    output: {
      publicPath: `/static/${pkg.name}/${process.env.VERSION || pkg.version}/`,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
  },
  /* use https://admin.bro-js.ru/ to create config, navigations and features */
  navigations: {
    "work21-front-brojs.main": "/work21-front-brojs",
  },
  features: {
    "work21-front-brojs": {
      // add your features here in the format [featureName]: { value: string }
    },
  },
  config: {
    "work21-front-brojs.api": "/api",
    "work21-front-brojs.api.estimator" : "/estimator"
  },
  // Укажите путь к кастомному HTML-шаблону для prom-режима или оставьте undefined
  htmlTemplatePath: undefined,
};
