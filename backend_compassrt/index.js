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


//connect to socket in nodejs
// listen for requests
server.listen(PORT, HOST, () => {
  console.log(`Server running on port ${HOST}:${PORT}`);
})
