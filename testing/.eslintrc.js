module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: "eslint:recommended",
  rules: {
    "no-empty": "error",
    "no-multiple-empty-lines": "warn",
    "no-var": "error",
    "prefer-const": "error",
  },
};
