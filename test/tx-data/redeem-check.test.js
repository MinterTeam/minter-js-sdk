import {RedeemCheckTxData} from '~/src';

describe('RedeemCheckTxData', () => {
    const privateKey = '5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da';
    const check = 'Mcf8ab3101830f423f8a4d4e5400000000000000888ac7230489e800008a4d4e5400000000000000b841f69950a210196529f47df938f7af84958cdb336daf304616c37ef8bebca324910910f046e2ff999a7f2ab564bd690c1102ab65a20e0f27b57a93854339b60837011ba00a07cbf311148a6b62c1d1b34a5e0c2b6931a0547ede8b9dfb37aedff4480622a023ac93f7173ca41499624f06dfdd58c4e65d1279ea526777c194ddb623d57027';
    const proof = '0x0497ea588f0fc2bd448de76d03a74cf371269e10ac1a02765fb5fa37c29f67e0348fb3faacd3370b8809401e7d562d8943f3642ce96667188d3c344e8e5bff6d01';
    const password = 'pass';
    const txParamsData = {check, proof};

    test('.fromRlp (proof)', () => {
        const txData = new RedeemCheckTxData({check, proof}).serialize();
        const params = RedeemCheckTxData.fromRlp(txData).fields;

        expect(params)
            .toEqual(txParamsData);
    });

    test('.fromRlp (password)', () => {
        const txData = new RedeemCheckTxData({check, password, privateKey}).serialize();
        const params = RedeemCheckTxData.fromRlp(txData).fields;

        expect(params)
            .toEqual(txParamsData);
    });
});
