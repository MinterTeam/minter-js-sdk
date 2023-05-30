module.exports = {
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/cjs/index.js',
        '~\/src\/utils\.js$': '<rootDir>/src/utils.js',
        '~\/test\/(.*)$': '<rootDir>/test/$1',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(pretty-num)/)',
    ],
    testEnvironment: 'node',
};
