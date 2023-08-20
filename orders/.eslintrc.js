module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: false,
    jest: true
  },
  extends: ['standard-with-typescript'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json']
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 1
  }
}
