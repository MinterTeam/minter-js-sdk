import {API_TYPE_GATE, API_TYPE_NODE} from '../variables';

/* eslint-disable-next-line import/prefer-default-export */
export function getData(response, apiType) {
    if (apiType === API_TYPE_GATE) {
        return response.data.data;
    } else {
        return response.data.result;
    }
}
