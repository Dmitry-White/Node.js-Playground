module.exports = {
  env: {
    node: true,
    es2020: true,
    jest: true,
    mocha: true,
  },
  extends: "eslint:recommended",
  rules: {
    "no-multiple-empty-lines": "warn",
    "no-var": "error",
    "prefer-const": "error",
  },
};
