module.exports = {
  env: {
    browser: true,
    node: true, // Node.js ortamını etkinleştir
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // Projeye özgü kurallar buraya eklenebilir
  },
}; 