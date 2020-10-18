module.exports = {
    bail: true,
    testRunner: 'jest-circus/runner',
    moduleNameMapper: {
        '~(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(minterjs-tx|minterjs-util|minterjs-wallet|lodash-es)/)',
    ],
    testEnvironment: 'node',
};
