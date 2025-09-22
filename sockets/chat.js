//chat.js
module.exports = (io, socket, onlineUsers, channels) => {
    


      socket.emit('channel list', Object.keys(channels));
      socket.on('new user', (username) => {
        onlineUsers[username] = socket.id;
        socket["username"] = username;
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username);
      })
    
      //Listen for new messages
      socket.on('new message', (data) => {
        //Save the new message to the channel.
        channels[data.channel].push({sender : data.sender, message : data.message});
        //Emit only to sockets that are in that channel room.
        io.to(data.channel).emit('new message', data);
      });

      socket.on('new channel', (newChannel) => {
        channels[newChannel] = [];
        socket.join(newChannel);
        io.emit('new channel', newChannel);
        socket.emit('user changed channel', {
            channel : newChannel,
            messages : channels[newChannel]
        });
      });

      socket.on('get channels', () => {
        socket.emit('channel list', Object.keys(channels));
      });

      socket.on('user changed channel', (newChannel) => {
        socket.join(newChannel);
        socket.emit('user changed channel', {
          channel : newChannel,
          messages : channels[newChannel]
        });
      });

      socket.on('get online users', () => {
        //Send over the onlineUsers
        socket.emit('get online users', onlineUsers);
      })

      socket.on('disconnect', () => {
        //This deletes the user by using the username we saved to the socket
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers);
      });




    
    }