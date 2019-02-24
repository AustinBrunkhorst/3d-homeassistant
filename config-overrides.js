const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const rewireProvidePlugin = require("react-app-rewire-provide-plugin");

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env);

  config = rewireProvidePlugin(config, env, {
    THREE: "three",
    FBXLoader: ["three/examples/js/loaders/FBXLoader.js", "THREE.FBXLoader"],
    Zlib: ["zlibjs/bin/zlib.min.js", "Zlib"]
  });

  const rules = config.module.rules.find(rule => !!rule.oneOf);

  if (!rules) {
    throw new Error("Couldn't find webpack rules.");
  }

  // load array buffer for fbx files
  rules.oneOf.unshift({
    test: /\.fbx/,
    use: [
      {
        loader: "arraybuffer-loader",
        options: {}
      }
    ]
  });

  return config;
};
