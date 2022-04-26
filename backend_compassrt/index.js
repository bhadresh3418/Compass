const express = require("express");  // express to handle requests and setting up server 
const cors = require("cors") // cors library to avoid cors errors
require('dotenv').config(); // dotenv to handle production credentials from .env file
const http = require("http");
const customResponses = require("./src/middlewares/customResponses"); //utilities or middleware which will structure response to make easy to send some known responses
// const finnhub = require('finnhub');
const connectSocket = require("./src/services/realtimeService.js");
const socketIo = require("socket.io");

// adding environment configuration variables
const ENV = require("./config/env");
const HOST = ENV.HOST;
const PORT = ENV.PORT;

const app = express(); // Create a new express application instance
app.use(cors()) // Configure middleware cors to avoid CORS errors
app.use(customResponses);
app.use(express.json()); //body parser will parse body json to object
app.use(express.urlencoded({ extended: false })); // Configure express to parse incoming JSON data

const connectMongoDb = require("./config/mongoose"); //mongo db connectivity
connectMongoDb(app);

// Router connectivity
const connectRouter = require("./router");
connectRouter(app);

//models
//users => create user model
//creating http server with integrated socket and connecting socket to finnhub realtime data
const server = http.createServer(app);
const serverIo = socketIo(server);
connectSocket(serverIo);

//connect to socket in nodejs // listen for requests
server.listen(PORT, HOST, () => { console.log(`Server running on port ${HOST}:${PORT}`);})
