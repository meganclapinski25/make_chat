// app.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { engine } = require('express-handlebars');
const socketio = require('socket.io');
const path = require('path');
// Socket.io
const { Server } = require('socket.io');

const io = new Server(server);
let onlineUsers = {};
let channels = {"General" : []};
io.on('connection', (socket) => {
  console.log('🔌 New user connected! 🔌');
  require('./sockets/chat.js')(io, socket, onlineUsers, channels);
});

// Handlebars
app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'))
// app.set('views', path.join(__dirname, 'views'));

// Static /public
app.use('/public', express.static('public'));

// Route
app.get('/', (req, res) => {
  res.render('index.handlebars');
});

server.listen(3000, () => {
  console.log('Server listening on Port 3000');
});
