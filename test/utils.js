// @TODO replace with .fields
// eslint-disable-next-line import/prefer-default-export
export function clearData(dirtyData) {
    // eslint-disable-next-line no-unused-vars
    const {raw, serialize, txData, fields, ...data} = dirtyData;
    Object.keys(data).forEach((key) => {
        data[key] = data[key].toString();
    });

    return data;
}
