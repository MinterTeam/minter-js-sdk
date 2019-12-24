// eslint-disable-next-line import/prefer-default-export
export function clearData(data) {
    delete data.raw;
    delete data.serialize;
    delete data.txData;
    Object.keys(data).forEach((key) => {
        data[key] = data[key].toString();
    });

    return data;
}
