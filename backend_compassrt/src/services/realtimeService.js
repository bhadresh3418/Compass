const UserStocks = require("../models/UserStocks");
const WebSocket = require('ws');
const ENV = require("../../config/env");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const { concatAll, Observable, throttleTime, mergeMap, reduce, bufferCount, map, bufferTime, of } = require('rxjs');
const { timeInterval, throttle } = require('rxjs/operators');

const registerLivedataHandlers = require("./socketHandlers/livedataHandler");
const registermockdataHandlers = require("./socketHandlers/mockdataHandler");

module.exports = (socketIo) =>
{
  console.log(ENV.FINHUB_API_KEY)

  //function that add middleware 


  const webSocket = new WebSocket('wss://ws.finnhub.io?token=' + ENV.FINHUB_API_KEY);

  webSocket.addEventListener('open', function (event)
  {

    const observable$ = new Observable(function subscribe(subscriber)
    {
      webSocket.addEventListener('message', function (event)
      {
        const data = JSON.parse(event.data);
        if (data.type === "trade")
        {
          data.data.forEach((trade) =>
          {
            subscriber.next(trade);
          })
        } else
        {
          console.log(data);
        }
      }
      );
    });

    observable$.pipe(bufferTime(1000)).subscribe((v) =>
    {
      // console.log(v)
      const groupBy = (xs, key) =>
      {
        // console.log(xs)
        return xs.reduce(function (rv, x)
        {
          rv[x[key]] = [x];
          return rv;
        }, {});
      };

      const grouped = groupBy(v, 's')
      Object.keys(grouped).forEach((trade) =>
      {
        socketIo.to(trade).emit(`livedata`, {
          type: 'trade',
          data: grouped[trade]
        });
      })
    })
  });




  // webSocket.addEventListener('message', function (event)
  // {
  //   const data = JSON.parse(event.data);
  //   if (!interval)
  //   {
  //     interval = setTimeout(() =>
  //     {
  //       if (data.type === "trade")
  //       {
  //         const groupBy = (xs, key) =>
  //         {
  //           return xs.reduce(function (rv, x)
  //           {
  //             rv[x[key]] = rv[x[key]] || []
  //             return rv;
  //           }, {});
  //         };
  //         const grouped = groupBy(data.data, 's');

  //         socketIo.in(Object.keys(grouped)).emit('livedata', data);
  //         // Object.values(grouped).forEach((stockArray) =>
  //         // {
  //         //   const lastOne = stockArray[stockArray.length - 1];
  //         //   socketIo.to(lastOne.s).emit(`livedata`, {
  //         //     data: [lastOne],
  //         //     type: "trade"
  //         //   });
  //         // })
  //       }
  //       clearTimeout(interval);
  //       interval = null
  //     }, 1000)
  //   }
  // });

  const onConnection = (socket) =>
  {

    console.log("New client connected");
    socket.emit(`livedata`, {
      type: "ready"
    });
    socket.emit(`mockdata`, {
      type: "ready"
    });
    registerLivedataHandlers(socketIo, socket, webSocket);
    registermockdataHandlers(socketIo, socket);
  }

  // socketIo.use(wrap(verifyToken));
  socketIo.on("connection", onConnection);

}