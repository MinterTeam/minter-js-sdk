module.exports = {
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/index.js',
        '~\/test\/(.*)$': '<rootDir>/test/$1',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(buffer-es6)/)',
    ],
    setupFilesAfterEnv: ["<rootDir>/jest-bundle-setup.js"],
};
