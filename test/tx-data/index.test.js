import {TX_TYPE} from 'minterjs-util';
import {getTxData} from '~/src';

describe('getTxData', () => {
    test.each(Object.values(TX_TYPE))('getTxData %s', (txType) => {
        // console.log(tx);
        expect(typeof getTxData(txType)).toBe('function');
    });
});
