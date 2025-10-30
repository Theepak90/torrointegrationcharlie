import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist', 'node_modules', '*.config.js'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': [
        'error',
        { ignore: ['p-id', 'input', 'fullWidth', 'as'] },
      ],
      'no-unused-vars': 'warn',
      'react/display-name': 'warn',
      'no-debugger': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-unescaped-entities': 'warn',
      'no-case-declarations': 'warn',
      'no-extra-boolean-cast': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
