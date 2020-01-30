// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  // parserOptions: {
  //   sourceType: 'module'
  // },
  env: {
    browser: true,
    jest: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'airbnb-base',
  settings: {
    'import/resolver': {
      alias: [
        ['~/src', './src'],
        ['~/test', './test'],
      ]
    }
  },
  // // add your custom rules here
  rules: {
    'indent': ['error', 4],
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
    'no-use-before-define' : 0,
    // allow single line imports
    'object-curly-newline': 0,
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
    'import/extensions': ['error', 'always', {ignorePackages: true} ],
  },
  overrides: [
    {
      files: ['examples/**/*', 'test/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'no-console': 0,
      }
    },
    {
      files: ['test/**/*'],
      rules: {
        'import/extensions': 0,
      }
    },
  ]
};
