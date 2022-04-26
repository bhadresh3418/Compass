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
        setInterval(() =>
        {
          // console.log("mock_",Object.assign(socket.adapter))

          Array.from(socket.adapter.rooms).forEach((room) =>
          {

            if (typeof (room[0]) === 'string' && room[0].split("_")[0] === "mock")
            {
              const stackname = room[0].split("_")[1];
              const generatedData = [{
                s: stackname,
                v: Math.random() * 1000,
                p: Math.random() * 100,
                mock: true
              }];
              socketIo.to(room[0]).emit(`mockdata`, {
                type: 'trade',
                data: generatedData
              });
            }
          })

        }, 1000);
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
