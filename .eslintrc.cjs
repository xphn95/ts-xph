module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard-with-typescript',
    'plugin:markdown/recommended',
    'plugin:json/recommended'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // eslint 报错需要加上这句
    project: ['./tsconfig.json']
  },
  plugins: [
    'vue'
  ],
  rules: {
  }
}
