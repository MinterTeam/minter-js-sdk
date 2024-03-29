import {isCoinSymbol, validateTicker, dataToInteger, dataPipToAmount, dataToAddress, dataToPublicKey, dataToBoolean} from '~/src/utils.js';

describe('isCoinSymbol', () => {
    let validTickers = [
        'ABC',
        'ABCDEFGHJK',
        'A12',
        '12A',
        '1A2',
        '123456789A',
        'A123456789',
        '12345A6789',
    ];
    for (let length = 3; length <= 10; length++) {
        validTickers.push(new Array(length).fill('A').join(''));
    }
    let validSymbolsWithVersion = [];
    let validLPs = [];
    (['1', '1234567890123456789012345678901234567890']).forEach((version) => {
        const versionString = version ? `-${version}` : '';
        validLPs.push(`LP${versionString}`);
        validTickers.forEach((ticker) => {
            const symbol = ticker + versionString;
            validSymbolsWithVersion.push(symbol);
        });
    });

    test.each([...validTickers, ...validLPs, ...validSymbolsWithVersion])('valid %s', (symbol) => {
        expect(isCoinSymbol(symbol)).toEqual(true);
    });

    test.each(validTickers)('valid ticker %s', (symbol) => {
        expect(isCoinSymbol(symbol, {allowLP: false, allowVersion: false})).toEqual(true);
    });
    test.each([...validLPs, ...validSymbolsWithVersion])('invalid ticker %s', (symbol) => {
        expect(isCoinSymbol(symbol, {allowLP: false, allowVersion: false})).toEqual(false);
    });
    test.each(validTickers)('validate ticker %s', (symbol) => {
        expect(() => validateTicker(symbol, '')).not.toThrow();
    });
    test.each([...validLPs, ...validSymbolsWithVersion])('validate ticker throw %s', (symbol) => {
        expect(() => validateTicker(symbol, '')).toThrow();
    });

    test('min length 3', () => {
        expect(isCoinSymbol('LP')).toEqual(false);
        expect(isCoinSymbol('A')).toEqual(false);
        expect(isCoinSymbol('AB')).toEqual(false);
    });

    test('max basic length without version: 10', () => {
        expect(isCoinSymbol('A2345678901')).toEqual(false);
        expect(isCoinSymbol('ABCDEFGHIJK')).toEqual(false);
    });

    test('at least one letter', () => {
        expect(isCoinSymbol('123')).toEqual(false);
        expect(isCoinSymbol('1234567890')).toEqual(false);
        expect(isCoinSymbol('123-1')).toEqual(false);
        expect(isCoinSymbol('123-A')).toEqual(false);
    });

    test('only digits after hyphen', () => {
        expect(isCoinSymbol('ASD-')).toEqual(false);
        expect(isCoinSymbol('ASD--')).toEqual(false);
        expect(isCoinSymbol('ASD-A')).toEqual(false);
        expect(isCoinSymbol('ASD-123A')).toEqual(false);
        expect(isCoinSymbol('ASD-123-1')).toEqual(false);
        expect(isCoinSymbol('LP-')).toEqual(false);
        expect(isCoinSymbol('LP--')).toEqual(false);
    });
});

describe('dataToInteger', () => {
    test('from integer', () => {
        expect(dataToInteger(123)).toEqual('123');
    });

    test('from hex string', () => {
        expect(dataToInteger('0x10')).toEqual('16');
    });

    test('from undefined', () => {
        expect(dataToInteger(undefined)).toEqual('0');
    });

    test('from null', () => {
        expect(dataToInteger(null)).toEqual('0');
    });

    test('from array', () => {
        expect(dataToInteger([])).toEqual('0');
        expect(dataToInteger([1, 50])).toEqual('306');
    });

    test('from Buffer', () => {
        expect(dataToInteger(Buffer.from([]))).toEqual('0');
        expect(dataToInteger(Buffer.from([1, 50]))).toEqual('306');
    });
});


describe('dataPipToAmount', () => {
    test('from integer', () => {
        expect(dataPipToAmount(123)).toEqual('0.000000000000000123');
    });

    test('from hex string', () => {
        expect(dataPipToAmount('0x10')).toEqual('0.000000000000000016');
    });

    test('from undefined', () => {
        expect(dataPipToAmount(undefined)).toEqual('0');
    });

    test('from null', () => {
        expect(dataPipToAmount(null)).toEqual('0');
    });

    test('from array', () => {
        expect(dataPipToAmount([])).toEqual('0');
        expect(dataPipToAmount([1, 50])).toEqual('0.000000000000000306');
    });

    test('from Buffer', () => {
        expect(dataPipToAmount(Buffer.from([]))).toEqual('0');
        expect(dataPipToAmount(Buffer.from([1, 50]))).toEqual('0.000000000000000306');
    });
});

describe('dataToAddress', () => {
    test('from hex string', () => {
        expect(dataToAddress('0x')).toEqual('Mx');
    });

    test('falsy to zero address', () => {
        expect(dataToAddress(0)).toEqual('Mx00');
        expect(dataToAddress(undefined)).toEqual('Mx');
        expect(dataToAddress(null)).toEqual('Mx');
        expect(dataToAddress([])).toEqual('Mx');
        expect(dataToAddress(Buffer.from([]))).toEqual('Mx');
        // const zeroAddress = 'Mx0000000000000000000000000000000000000000';
        // expect(dataToAddress(0)).toEqual(zeroAddress);
        // expect(dataToAddress(undefined)).toEqual(zeroAddress);
        // expect(dataToAddress(null)).toEqual(zeroAddress);
        // expect(dataToAddress([])).toEqual(zeroAddress);
        // expect(dataToAddress(Buffer.from([]))).toEqual(zeroAddress);
    });
});

describe('dataToPublicKey', () => {
    test('from invalid hex string', () => {
        expect(() => dataToPublicKey('0x')).toThrow();
    });

    test('falsy to zero public key', () => {
        expect(() => dataToPublicKey(0)).toThrow();
        expect(() => dataToPublicKey(undefined)).toThrow();
        expect(() => dataToPublicKey(null)).toThrow();
        expect(() => dataToPublicKey([])).toThrow();
        expect(() => dataToPublicKey(Buffer.from([]))).toThrow();
        // const zeroPublicKey = 'Mp0000000000000000000000000000000000000000000000000000000000000000';
        // expect(dataToPublicKey(0)).toEqual(zeroPublicKey);
        // expect(dataToPublicKey(undefined)).toEqual(zeroPublicKey);
        // expect(dataToPublicKey(null)).toEqual(zeroPublicKey);
        // expect(dataToPublicKey([])).toEqual(zeroPublicKey);
        // expect(dataToPublicKey(Buffer.from([]))).toEqual(zeroPublicKey);
    });
});

describe('dataToBoolean', () => {
    describe('truthy', () => {
        test('from integer', () => {
            expect(dataToBoolean(1)).toEqual(true);
        });
        test('from hex string', () => {
            expect(dataToBoolean('0x01')).toEqual(true);
        });
        test('from array', () => {
            expect(dataToBoolean([1])).toEqual(true);
        });
        test('from Buffer', () => {
            expect(dataToBoolean(Buffer.from([1]))).toEqual(true);
        });
    });

    test('from integer', () => {
        expect(dataToBoolean(0)).toEqual(null);
    });

    describe('falsy', () => {
        test('from hex string', () => {
            expect(dataToBoolean('0x')).toEqual(false);
        });
        test('from undefined', () => {
            expect(dataToBoolean(undefined)).toEqual(false);
        });
        test('from null', () => {
            expect(dataToBoolean(null)).toEqual(false);
        });
        test('from array', () => {
            expect(dataToBoolean([])).toEqual(false);
        });
        test('from Buffer', () => {
            expect(dataToBoolean(Buffer.from([]))).toEqual(false);
        });
    });
});
