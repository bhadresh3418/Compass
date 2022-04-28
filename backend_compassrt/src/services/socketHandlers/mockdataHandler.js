const { concatAll, Observable, throttleTime, mergeMap, reduce, bufferCount, map, bufferTime, of } = require('rxjs');
const { timeInterval, throttle } = require('rxjs/operators');
module.exports = (socketIo, socket, webSocket) =>
{
  const handleMockData = (data) =>
  {
    console.log("joined mockdata")
    const parsedData = data
    console.log(data);
    switch (parsedData.type)
    {
      case "start":

        const observable$ = new Observable(function subscribe(subscriber)
        {
          setInterval(() =>
          {
            Array.from(socket.adapter.rooms).forEach((room) =>
            {

              if (typeof (room[0]) === 'string' && room[0].split("_")[0] === "mock")
              {
                const stackname = room[0].split("_")[1];
                const generatedData = {
                  s: stackname,
                  v: Math.random() * 1000,
                  p: Math.random() * 100,
                  mock: true
                };
                subscriber.next(generatedData);

              }
            })
          }, 10);
        });
        observable$.pipe(bufferTime(1000)).subscribe((v) =>
        {
          const groupBy = (xs, key) =>
          {
            return xs.reduce(function (rv, x)
            {
              rv[x[key]] = [x];
              return rv;
            }, {});
          };
          const grouped = groupBy(v, 's')
          Object.keys(grouped).forEach((trade) =>
          {
            socketIo.to('mock_' + trade).emit(`mockdata`, {
              type: 'trade',
              data: grouped[trade]
            });
          })
          // console.log("grouped", grouped);
        })

        break;
      case "subscribe":
        socket.join("mock_" + parsedData.data); // 5
        console.log(socket.adapter.rooms);
        console.log("joined mock room", parsedData.data)
        break;
      case "unsubscribe":
        console.log("left from mock room", parsedData.data)
        socket.leave("mock_" + parsedData.data);
        socketIo.in("mock_" + parsedData.data).allSockets().then(result =>
        {
          if (result.size === 0)
          {
            console.log("un-subscribed to ", parsedData.data)
          }
        });
      default:
        console.log("not matching any type")
    }
  }
  socket.on("mockdata", handleMockData);
}
