const express = require("express");  // express to handle requests and setting up server 
const cors = require("cors");  // cors library to avoid cors errors
const socketIo = require("socket.io");
const http = require("http");

require('dotenv').config();  // dotenv to handle production credentials from .env file

// adding environemtnt configuration variables
const ENV = require("./config/env");
const HOST = ENV.HOST;
const PORT = ENV.PORT;

// Create a new express application instance
const app = express()

// Configure middleware cors to avoid CORS errors
app.use(cors())

// Configure express to parse incoming JSON data
app.use(express.urlencoded({ extended: false }))

app.use("/api", require("./router/serviceRouter"))

app.get("/", (req, res) => {
  return res.status(200).json("Welcome to nodejs server");
})

//creating http server with integrated socket
const server = http.createServer(app);
const io = socketIo(server);

let interval;

io.on("connection", (socket) => {

  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }

  //set interval will call getApiAndEmit per 1s interval
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});


const getApiAndEmit = socket => {
  const random = () => {
    return Math.random() * 5;
  };

  //adding dummy data and using random function will return random string price and market cap
  const data = [{
    id:1,
    name: "crud",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }, {
    id:2,
    name: "ISRT",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }, {
    id:3,
    name: "RRTC",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }, {
    id:4,
    name: "SSR",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }, {
    id:5,
    name: "INDD",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }, {
    id:6,
    name: "HTC",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }, {
    id:7,
    name: "APPL",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }, {
    id:8,
    name: "SSRT",
    price: (random()).toFixed(2),
    marketCap: (random() * 10000).toFixed(2),
  }];
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", data);
};

//connect to socket in nodejs
// listen for requests
server.listen(PORT, () => {
  console.log(`Server running on port ${HOST}:${PORT}`);
})
