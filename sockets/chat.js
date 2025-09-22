//chat.js
module.exports = (io, socket, onlineUsers) => {
    
      socket.on('new user', (username) => {
        onlineUsers[username] = socket.id;
        socket["username"] = username;
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username);
      })

      socket.on('get online users', () => {
        //Send over the onlineUsers
        socket.emit('get online users', onlineUsers);
      })

      socket.on('disconnect', () => {
        //This deletes the user by using the username we saved to the socket
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers);
      });
    
      //Listen for new messages
      socket.on('new message', (data) => {
        // Send that data back to ALL clients
        console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
        io.emit('new message', data);
      })



    
    }