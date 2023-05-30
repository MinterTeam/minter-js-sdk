// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  // parserOptions: {
  //   sourceType: 'module'
  // },
  env: {
    browser: true,
    jest: true,
  },
  plugins: [
    'jest',
    'security',
    'unicorn',
    'jsdoc',
  ],
  extends: [
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      alias: [
        ['~/src', './src'],
        ['~/test', './test'],
      ]
    },
    'jsdoc': {
      mode: 'jsdoc', // instead of 'typescript'
      tagNamePreference: {
        // "return": "return",
      },
    },
  },
  // // add your custom rules here
  rules: {
    'indent': ['error', 4, {SwitchCase: 1}],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow braces around function body
    'arrow-body-style': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'object-curly-spacing': 0,
    // disable length limit
    'max-len': 0,
    // allow `new Buffer()`
    'no-buffer-constructor': 0,
    // allow assigning to function parameter
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-else-return': 0,
    'no-unused-vars': ['warn', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    'no-use-before-define' : 0,
    'no-multiple-empty-lines': ["error", { "max": 3, "maxEOF": 1 }],
    // allow single line imports
    'object-curly-newline': 0,
    'prefer-arrow-callback': 0,
    // allow Object.assign()
    'prefer-object-spread': 0,
    'prefer-const': 0,
    // disable for nested destructuring
    "prefer-destructuring": ["error", {
      "AssignmentExpression": {
        "array": false,
        "object": false
      }
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    'import/extensions': ['error', 'always', {ignorePackages: true} ],
    // named exports are not bad
    'import/prefer-default-export': 0,
    // allow `export {default} from '...'`
    'no-restricted-exports': 0,
  },
  overrides: [
    {
      files: ['src/**/*'],
      extends: [
        'plugin:security/recommended',
        'plugin:unicorn/recommended',
        'plugin:jsdoc/recommended',
      ],
      rules: {
        'security/detect-object-injection': 0,
        'unicorn/better-regex': 0,
        // full path import is per spec
        'unicorn/import-index': 0,
        // IE11 support needed
        'unicorn/prefer-includes': 0,
        // allow lowercase hex number
        'unicorn/number-literal-case': 0,
        // allow explicitly return undefined
        'unicorn/no-useless-undefined': 0,
        // allow forEach
        'unicorn/no-array-for-each': 0,
        // allow negated
        'unicorn/no-negated-condition': 0,
        'unicorn/prefer-optional-catch-binding': 0,
        'unicorn/prefer-ternary': 0,
        // available since node@15
        // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll#browser_compatibility
        'unicorn/prefer-string-replace-all': 0,
        // available since node@16.6
        // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at#browser_compatibility
        'unicorn/prefer-at': 0,
        // waiting `node:` to be backported to node@14
        // @see https://stackoverflow.com/questions/67263317/how-to-fix-eslint-error-when-using-the-node-protocol-when-importing-node-js-bui
        // @see https://github.com/import-js/eslint-plugin-import/issues/2031
        'unicorn/prefer-node-protocol': 0,
        // incorrectly treat `Big` as `Number`
        // wontfix https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1463
        'unicorn/require-number-to-fixed-digits-argument': 0,
        // not supported yet
        'unicorn/numeric-separators-style': 0,
        'unicorn/prevent-abbreviations': ['error', {
          replacements: {
            'params': false,
          },
          allowList: {
            'fn': true,
            'otherArgs': true,
            'resData': true,
            'txParams': true,
            'txProps': true,
          }
        }],
        // jsdoc
        'jsdoc/require-param-description': 0,
        'jsdoc/require-returns-description': 0,
        'jsdoc/require-property-description': 0,
        'jsdoc/newline-after-description': 0,
        // poor syntax validator
        'jsdoc/valid-types': 0,
        // @TODO allow both return and returns
        'jsdoc/require-returns': 0,
        // @TODO allow both return and returns
        'jsdoc/check-tag-names': 0,
        // @TODO all custom types treated as undefined
        'jsdoc/no-undefined-types': 0,
      },
    },
    {
      files: ['examples/**/*', 'test/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'no-console': 0,
      }
    },
    {
      files: ['test/**/*'],
      extends: [
        'plugin:jest/recommended',
      ],
      rules: {
        'no-unused-vars': 0,
        'import/extensions': 0,
        // 'jest-expect-message' allow multiple arguments
        'jest/valid-expect': 0,
        // allow `expect` inside `then`
        'jest/no-conditional-expect': 0,
      }
    },
  ]
};
