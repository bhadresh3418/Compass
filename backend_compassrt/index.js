const express = require("express");  // express to handle requests and setting up server 
const cors = require("cors")
require('dotenv').config();;  // cors library to avoid cors errors

const http = require("http");
const customResponses = require("./src/middlewares/customResponses"); //utilities or middleware which will strucutre response to make easy to send some known responses
// const finnhub = require('finnhub');
const connectSocket = require("./src/services/realtimeService.js");
const socketIo = require("socket.io");
// dotenv to handle production credentials from .env file

// adding environemtnt configuration variables
const ENV = require("./config/env");
const HOST = ENV.HOST;
const PORT = ENV.PORT;

// Create a new express application instance
const app = express();

// Configure middleware cors to avoid CORS errors
app.use(cors())
app.use(customResponses);
//body parser will parse body json to object
app.use(express.json());

// Configure express to parse incoming JSON data
app.use(express.urlencoded({ extended: false }));

//mongo db connectivity
const connectMongoDb = require("./config/mongoose");
connectMongoDb(app);

// Router connectivity
const connectRouter = require("./router");
connectRouter(app);

//models
// users => create user model
//creating http server with integrated socket and connecting socket to finnhub realtime data
const server = http.createServer(app);
const serverIo = socketIo(server);
connectSocket(serverIo);

// const getApiAndEmit = socket => {
//   const random = () => {
//     return Math.random() * 5;
//   };

//   //adding dummy data and using random function will return random string price and market cap
//   const data = [{
//     id: 1,
//     name: "crud",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }, {
//     id: 2,
//     name: "ISRT",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }, {
//     id: 3,
//     name: "RRTC",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }, {
//     id: 4,
//     name: "SSR",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }, {
//     id: 5,
//     name: "INDD",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }, {
//     id: 6,
//     name: "HTC",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }, {
//     id: 7,
//     name: "APPL",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }, {
//     id: 8,
//     name: "SSRT",
//     price: (random()).toFixed(2),
//     marketCap: (random() * 10000).toFixed(2),
//   }];
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", data);
// };

//connect to socket in nodejs
// listen for requests
server.listen(PORT, HOST, () => {
  console.log(`Server running on port ${HOST}:${PORT}`);
})
