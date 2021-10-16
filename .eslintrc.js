module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'security/detect-object-injection': 'off',
    'no-control-regex': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@next/next/no-img-element': 'off',
  },
}
