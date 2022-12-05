module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
    eqeqeq: "warn",
    "no-debugger": "error",
    camelcase: "warn",
  },
  ignorePatterns: [".eslintrc.js", "package*", "webpack*", "postcss.config.js"],
};
