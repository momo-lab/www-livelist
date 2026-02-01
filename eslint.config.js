import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // ビルド成果物などは除外
  globalIgnores(['dist', 'node_modules']),

  // JS推奨ルール
  js.configs.recommended,

  // TypeScript推奨ルール（型チェック無しのlint）
  ...tseslint.configs.recommended,

  // Vite + React Refresh向け
  reactRefresh.configs.vite,

  // =========================
  // Browser（src）向け
  // =========================
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // React Refresh: コンポーネント export に関する制約（必要ならONに戻す）
      'react-refresh/only-export-components': 'off',

      // Hooksルール
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 使ってない変数はエラー（_ で始まるものは許可）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // =========================
  // Node（vite.config / scripts）向け
  // =========================
  {
    files: ['vite.config.ts', 'scripts/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
    rules: {
      // Nodeスクリプトはconsoleを普通に使うので許可したいならON
      // 'no-console': 'off',
    },
  },

  // =========================
  // CommonJS config（例: *.config.js）
  // =========================
  {
    files: ['**/*.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
