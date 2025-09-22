//index.js
$(document).ready(()=>{
    const socket = io.connect();
  
    //Keep track of the current user
    let currentUser;
    let onlineUsers = {};
    socket.emit('get online users');


    $('#create-user-btn').click((e)=>{
      e.preventDefault();
      if($('#username-input').val().length > 0){
        socket.emit('new user', $('#username-input').val());
        // Save the current user when created
        currentUser = $('#username-input').val();
        $('.username-form').remove();
        $('.main-container').css('display', 'flex');
        for(username in onlineUsers){
            $('.users-online').append(`<div class="user-online">${username}</div>`);
          }
      }
    });

   
    
  
    $('#send-chat-btn').click((e) => {
      e.preventDefault();
      // Get the message text value
      let message = $('#chat-input').val();
      // Make sure it's not empty
      if(message.length > 0){
        // Emit the message with the current user to the server
        socket.emit('new message', {
          sender : currentUser,
          message : message,
        });
        $('#chat-input').val("");
      }
    });

    $('#new-channel-btn').click( () => {
        let newChannel = $('#new-channel-input').val();
      
        if(newChannel.length > 0){
          // Emit the new channel to the server
          socket.emit('new channel', newChannel);
          $('#new-channel-input').val("");
        }
      });
  
    //socket listeners
    socket.on('new user', (username) => {
      console.log(`${username} has joined the chat`);
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    })

    socket.on('user has left', (onlineUsers) => {
        $('.users-online').empty();
        for(username in onlineUsers){
          $('.users-online').append(`<p>${username}</p>`);
        }
      });

    socket.on('new channel', (newChannel) => {
        $('.channels').append(`<div class="channel">${newChannel}</div>`);
      });

    socket.on('user changed channel', (data) => {
        $('.channel-current').addClass('channel');
        $('.channel-current').removeClass('channel-current');
        $(`.channel:contains('${data.channel}')`).addClass('channel-current');
        $('.channel-current').removeClass('channel');
        $('.message').remove();
        data.messages.forEach((message) => {
          $('.message-container').append(`
            <div class="message">
              <p class="message-user">${message.sender}: </p>
              <p class="message-text">${message.message}</p>
            </div>
          `);
        });
      });

    //Output the new message
    socket.on('new message', (data) => {
        $('.message-container').append(`
            <div class="message">
            <p class="message-user">${data.sender}: </p>
            <p class="message-text">${data.message}</p>
            </div>
        `);
})
  
  })