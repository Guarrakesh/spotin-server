module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  rules: {
    "import/no-extraneous-dependencies": ["error", {"packageDir": "./", "devDependencies": false, "optionalDependencies": false, "peerDependencies": false}],
    "no-console": 1,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  },
  "settings": {
    "import/resolver": {
      "babel-module": {
        "extensions": [".js", ".jsx"],
        "alias": {
          "business": "./src/containers/business"
        },

      },
      "node": {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    },
    "import/extensions": [".js", ".jsx"]
  }
};
