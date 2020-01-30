import {RedeemCheckTxData} from '~/src';
import {clearData} from '~/test/utils';

describe('RedeemCheckTxData', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const check = 'Mcf8a002843b9ac9ff8a4d4e5400000000000000888ac7230489e80000b841ed4e21035ad4d56901422c19e7fc867a63dcab709d6d0dcc0b6333cb7365d187519e1291bbc002189e7030dedfbbc4feb733da73f9409de4f01365dd3f5f4927011ca0507210c64b3aeb7c81a2db06204b935814c28482175dee756b1f05414d18e594a06173c7c8ee51ad76e9704a39ffc5c0ab11514d8b68efcbc8df1db194d9e296ee';
    const proof = '0x7adcf6a62a66b177b266c767c5ebd906651fb66269401a8c66d053574dc29c67296b93af2e276fbdf5f606a98419ae69191450f67a2d273ee6c5d3016773c16d01';
    const password = '123';
    const txParamsData = {check, proof};

    test('.fromRlp (proof)', () => {
        const txData = new RedeemCheckTxData({check, proof}).serialize();
        const params = clearData(RedeemCheckTxData.fromRlp(txData));

        expect(params)
            .toEqual(clearData(txParamsData));
    });

    test('.fromRlp (password)', () => {
        const txData = new RedeemCheckTxData({check, password, privateKey}).serialize();
        const params = clearData(RedeemCheckTxData.fromRlp(txData));

        expect(params)
            .toEqual(clearData(txParamsData));
    });
});
