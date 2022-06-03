module.exports = {
    bail: true,
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
    // collectCoverage: true,
    collectCoverageFrom: ["./src/**"],
    coverageReporters: ["lcov", "text"]
};
