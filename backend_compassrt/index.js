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

const webSocket = new WebSocket('wss://ws.finnhub.io?token=' + ENV.FINHUB_API_KEY);

const startListening = async () => {
  // Connection opened -> Subscribe
  //connection called whenever socket connect with client

  // if (interval) {
  //   clearInterval(interval);
  // }
  webSocket.addEventListener('open', function (event) {
    console.log("ready");
    serverIo.on("connection", (socket) => {
      console.log("New client connected");
      socket.emit("livedata", JSON.stringify({
        type: "ready"
      }));

      socket.on(`subscribe`, (data) => {
        console.log(data)
        const list = data.split(",");
        list.map((stockName) => {
          console.log("added to subscribe", stockName)
          webSocket.send(JSON.stringify({ type: 'subscribe', symbol: stockName }))
        });
      })

      socket.on("unsubscribe", (data) => {
        webSocket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': data }))
      })

      webSocket.addEventListener('message', function (event) {
        socket.emit(`livedata`, event.data);
        console.log('\n\nMessage from server ', event.data);
      });

      socket.on("disconnect", () => {
        webSocket.removeEventListener('message',(data)=>{
          console.log(data)
        });
        console.log("Client disconnected");
        clearInterval(interval);
      });
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

//connect to socket in nodejs
// listen for requests
server.listen(PORT, () => {
  console.log(`Server running on port ${HOST}:${PORT}`);
})
