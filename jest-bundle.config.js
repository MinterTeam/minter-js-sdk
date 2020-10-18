module.exports = {
    testRunner: 'jest-circus/runner',
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/index.js',
        // '~\/src\/(.*)$': '<rootDir>/src/$1',
        '~\/src\/utils\.js$': '<rootDir>/src/utils.js',
        '~\/test\/(.*)$': '<rootDir>/test/$1',
    },
    transform: {
        // ensure dist/ not transpiled
        // '^.+\\.jsx?$': 'babel-jest',
        'src\/utils\.js$': 'babel-jest',
        'test\/.+\\.jsx?$': 'babel-jest',
        'node_modules\/.+\\.jsx?$': 'babel-jest',
        'jest-bundle-setup\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(buffer-es6)/)',
    ],
    setupFilesAfterEnv: ["<rootDir>/jest-bundle-setup.js"],
};
