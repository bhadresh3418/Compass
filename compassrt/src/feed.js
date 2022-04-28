import io from "socket.io-client";
import env from 'react-dotenv';
const token = localStorage.getItem('token');
const socket = io(`${env.SOCK_BASE_URL}?token=${token}`, { transports: ['websocket'] });

export const liveFeed = (function ()
{
  return {
    onChange: function (callback)
    {
      socket.on('livedata', callback);
    },
    watch: function (symbol)
    {
      socket.emit('livedata', {
        type: 'subscribe',
        data: symbol
      });
    },
    unwatch: function (symbol)
    {
      socket.emit('livedata', {
        type: 'unsubscribe',
        data: symbol
      });
    },
    start: function ()
    {
      socket.emit('livedata', {
        type: 'start'
      })
    }
  };

}());


export const mockFeed = (function ()
{
  return {
    onChange: function (callback)
    {
      socket.on('mockdata', callback);
    },
    watch: function (symbol)
    {
      socket.emit('mockdata', {
        type: 'subscribe',
        data: symbol
      });
    },
    unwatch: function (symbol)
    {
      socket.emit('mockdata', {
        type: 'unsubscribe',
        data: symbol
      });
    },
    start: function ()
    {
      socket.emit('mockdata', {
        type: 'start'
      })
    }
  };

}());
