const env = require("./env.js");
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = env.FINHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi()

module.exports = finnhubClient;

