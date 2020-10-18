module.exports = {
    testRunner: 'jest-circus/runner',
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/cjs/index.js',
        '~\/src\/utils\.js$': '<rootDir>/src/utils.js',
        '~\/test\/(.*)$': '<rootDir>/test/$1',
    },
    testEnvironment: 'node',
};
