module.exports = (socketIo, socket, webSocket) =>
{
  const handleLivedata = (data) =>
  {
    const parsedData = data
    console.log(data);
    switch (parsedData.type)
    {
      case "start":
        console.log("started listening...")
        break;
      case "subscribe":
        socket.join(parsedData.data);
        webSocket.send(JSON.stringify({ type: 'subscribe', symbol: parsedData.data }));
        console.log("added to list", parsedData.data)
        break;
      case "unsubscribe":
        socket.leave(parsedData.data);
        socketIo.in(parsedData.data).allSockets().then(result =>
        {
          if (result.size === 0)
          {
            console.log("un-subscribed to ", parsedData.data)
            webSocket.send(JSON.stringify({ type: 'unsubscribe', symbol: parsedData.data }));
          }
        });
      default:
        console.log("not matching any type")
    }
  }
  socket.on("livedata", handleLivedata);
}
