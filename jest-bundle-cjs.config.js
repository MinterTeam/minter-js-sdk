module.exports = {
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/cjs/index.js',
        '~\/test\/(.*)$': '<rootDir>/test/$1',
    },
    testEnvironment: 'node',
};
