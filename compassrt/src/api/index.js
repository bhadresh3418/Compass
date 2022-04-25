import instance from "./instance";
import * as RequestApi from "./RequestApi";


//common functions to manage request , response and handling error

const sendError = (err, showConsole = false) => {
    if (showConsole) {
        console.log(err);
    }
    if (err.response.data) {
        return err.response.data;
    } else {
        return {
            success: false,
            message: err.message
        };
    }
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
        return sendError(err, true);
    }
}

export const login = async (data) => {
    try {
        //getting only values whatever we need from the object is called object destructuring
        const {
            email,
            password
        } = data;
        console.log("email : ",email,"pass :",password);
        
        const body = {
            email,
            password
        }
        const response = await postRequest(RequestApi.authRequest.login, body);
        return response.data;
    } catch (err) {
        return sendError(err, true);
    }
}

export const signUp = async (data) => {
    try {
        const {
            email,
            password,
            firstname,
            lastname
        } = data;
        const body = {
            email,
            password,
            firstname,
            lastname
        }
        const response = await postRequest(RequestApi.authRequest.signup, body);
        return response.data;
    } catch (err) {
        return sendError(err, true);
    }
}

export const searchStock = async (data) => {
    try{
        const response = await getRequest(`${RequestApi.stockRequest.stockLookup}?q=${data}`);
        return response.data;
    }catch(err){
        return sendError(err, true);
    }
}
