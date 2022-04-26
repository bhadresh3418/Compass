// This file contains each and every endpoints to send request to backend

//Authenntication APIs endpoints 
const authRequest = {
    login: "/auth/login",
    signup: "/auth/signup",
};

//Datas APIs endpoints 
const serviceRequest = {
    getData: "/service/getData",
};

const stockRequest = {
    stockLookup: "/stock/stockLookup",
    getWatchlist: "/stock/getWatchlist",
    addToWatchlist: "/stock/addToWatchlist"
}


export
{
    authRequest,
    serviceRequest,
    stockRequest
};
