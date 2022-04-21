// This file contains each and every endpoints to send request to backend

//Authenntication APIs endpoints 
const authRequest = {
    login: "/auth/login",
    signup: "/auth/sign_up",
};

//Datas APIs endpoints 
const serviceRequest = {
    getData: "/service/getData",
};


export {
    authRequest,
    serviceRequest
};
