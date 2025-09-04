const path = require("path");
module.exports = {
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        implementation: require('sass')
      },
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
        BaseComponents: path.resolve(__dirname, "src/baseComponents/"),
        Components: path.resolve(__dirname, "src/components/"),
        Overlays: path.resolve(__dirname, "src/overlays/"),
        Indicators: path.resolve(__dirname, "src/overlays/indicators/"),
        Tools: path.resolve(__dirname, "src/overlays/tools/"),
        ChartTypes: path.resolve(__dirname, "src/overlays/chartTypes/"),
        Data: path.resolve(__dirname, "src/data/"),
        Utils: path.resolve(__dirname, "src/utils/"),
        services: path.resolve(__dirname, "src/services/"),
      },
      extensions: [".js", ".vue", ".json"],
    },
  },
};
