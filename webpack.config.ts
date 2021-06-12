import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import * as fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import packageJson from "./package.json";

// TODO: Don't detect container by reading this file, it does
//  not always exist.
const inDocker = fs.existsSync("/.dockerenv");

const config = (env: Record<string, unknown>): webpack.Configuration => {
  const isProd = env && env.production;

  const config: webpack.Configuration = {
    entry: "./src/index.tsx",
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            ...(isProd
              ? []
              : [
                {
                  loader: "babel-loader",
                  options: {
                    plugins: ["react-refresh/babel"],
                  },
                },
              ]),
            {
              loader: "ts-loader",
            },
          ],
          include: path.resolve(__dirname, "src"),
        },
        {
          test: /\.(svg|png)$/i,
          use: "url-loader",
        },
        {
          test: /(?<!\.module)\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.module\.css$/,
          include: path.resolve(__dirname, "src"),
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: "[name]__[local]__[contenthash:base64:5]",
                },
              },
            },
            "postcss-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    output: {
      filename: "[name].[contenthash].js",
      publicPath: "/",
      path: path.resolve(__dirname, "build"),
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: "-",
      },
      runtimeChunk: {
        name: "manifest",
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html",
      }),
      new webpack.DefinePlugin({
        __BUILD_INFO__: JSON.stringify({
          appName: packageJson.name,
          appBuildTime: new Date().toISOString(),
        }),
      }),
    ],
  };

  return {
    ...config,
    mode: "development",
    // https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/e6774d935d11410a7928cb499b384fb7b592a162/docs/TROUBLESHOOTING.md#webpack-5-compatibility-issues-with-webpack-dev-server3
    target: "web",
    cache: true,
    devtool: "eval-source-map",
    devServer: {
      host: inDocker ? "0.0.0.0" : "127.0.0.1",
      disableHostCheck:
        process.env.DANGEROUSLY_DISABLE_HOST_CHECK === "true" ? true : false,
      contentBase: "./build",
      port: 3000,
      historyApiFallback: true,
      hot: true,
    },
    module: {
      rules: [
        ...(config.module?.rules ?? []),
        {
          enforce: "pre",
          test: /\.*js$/,
          loader: "source-map-loader",
        },
      ],
    },
    plugins: [...(config.plugins ?? []), new ReactRefreshPlugin()],
    ignoreWarnings: [
      {
        message: /Failed to parse source map/,
      },
    ],
  }
};

export default config;
