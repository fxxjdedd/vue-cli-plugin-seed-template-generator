module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
}
