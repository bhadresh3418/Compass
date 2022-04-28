import io from "socket.io-client";
import env from 'react-dotenv';
const token = localStorage.getItem('token');

export const feed = (function () {

  const socket = io(`${env.SOCK_BASE_URL}?token=${token}`, { transports: ['websocket'] }); // important thing is adding websocket transporter to using socket 
  console.log("socket",socket.connected)
  return {
      onChange: function(callback) {
          socket.on('mockdata', callback);
      },
      watch: function(symbol) {
          socket.emit('mockdata', {
            type:'subscribe',
            data:symbol
          });
      },
      unwatch: function(symbol) {
        socket.emit('mockdata', {
          type:'unsubscribe',
          data:symbol
        });
      },
      start: function(){
        socket.emit('mockdata',{
          type:'start'
        })
      }
  };

}());