const express = require("express");  // express to handle requests and setting up server 
const cors = require("cors");  // cors library to avoid cors errors
const socketIo = require("socket.io");
const http = require("http");
const customResponses = require("./src/middleware/customResponses"); //utilities or middleware which will strucutre response to make easy to send some known responses
// const finnhub = require('finnhub');
const WebSocket = require('ws');

require('dotenv').config();  // dotenv to handle production credentials from .env file

// adding environemtnt configuration variables
const ENV = require("./config/env");
const HOST = ENV.HOST;
const PORT = ENV.PORT;

// Create a new express application instance
const app = express();

// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = ENV.FINHUB_API_KEY // Replace this
// const finnhubClient = io('wss://ws.finnhub.io?token=' + ENV.FINHUB_WEBHOOK_SECRET_KEY)
const webSocket = new WebSocket('wss://ws.finnhub.io?token=' + ENV.FINHUB_API_KEY);

const startListening = async () => {
  // Connection opened -> Subscribe
  //connection called whenever socket connect with client
  serverIo.on("connection", (socket) => {
    console.log("New client connected");
    // if (interval) {
    //   clearInterval(interval);
    // }
    webSocket.addEventListener('open', function (event) {
      const id = 1;
      console.log("ready");
      socket.on("restart", () => {

      });
      socket.emit("readyToStart", "ok");
      // webSocket.send(JSON.stringify({ type: 'subscribe', symbol: "AAPL" }))
      socket.on(`subscribe`, (data) => {
        console.log(data)
        const list = data.split(",");
        console.log(data, list)
        //   // const list = JSON.parse(data);
        //   webSocket.send(JSON.stringify({ type: 'subscribe', symbol: "AAPL" }))
        list.map((stockName) => {
          webSocket.send(JSON.stringify({ type: 'subscribe', symbol: stockName }))
        });

        webSocket.addEventListener('message', function (event) {
          socket.emit(`livedata`, event.data);
          console.log('\n\nMessage from server ', event.data);
        });
      })

      socket.on("unsubscribe", (data) => {
        webSocket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': data }))
      })
      // socket.emit("connection_established");


      // socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }))
      // socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'BINANCE:BTCUSDT' }))
      // socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'IC MARKETS:1' }))
    });
    // Listen for messages
    //set interval will call getApiAndEmit per 1s interval
    // interval = setInterval(() => getApiAndEmit(socket), 1000);

    //disconnet will called whenevr socket disconnected
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });



  // Unsubscribe

}



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

const connectRouter = require("./router");
connectRouter(app);

//models
// users => create user model
//creating http server with integrated socket
const server = http.createServer(app);
const serverIo = socketIo(server);

let interval;


startListening();


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
server.listen(PORT, () => {
  console.log(`Server running on port ${HOST}:${PORT}`);
})
