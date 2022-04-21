import instance from "./instance";
import * as RequestApi from "./RequestApi";


//common functions to manage request , response and handling error

const sendError = (err, showConsole = false) => {
    if (showConsole) {
        console.log(err);
    }
    return err.message;
}

const postRequest = async (URI, data, headers = null) => {
    const res = await instance.post(URI, data, headers);
    return res;
}

const getRequest = async (URI, headers = null) => {
    const res = await instance.get(URI, null, headers);
    return res;
}

// Users APIs starting from here

export const getData = async () => {
    try {
        const response = await getRequest(RequestApi.serviceRequest.getData);
        return response;
    } catch (err) {
        sendError(err, true);
    }
}

export const login = async (data) => {
    try {
        const {
            email,
            password,
        } = data;
        const body = {
            email,
            password
        }
        const response = await postRequest(RequestApi.authRequest.login, body);
        return response;
    } catch (err) {
        sendError(err, true);
    }
}
