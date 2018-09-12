const path = require('path');
const http = require('http'); 
const express = require('express');
const socketIO = require('socket.io'); 

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express(); 
var server = http.createServer(app); 
var io = socketIO(server); 

app.use(express.static(publicPath));

// special event listener
io.on('connection', (socket) => {
    console.log('New user connected'); 

    // this user gets 
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app')); 

    // every other user gets 
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined')); 

    socket.on('createMessage', (message, callback) => {
        console.log('New Message: ', message); 
        // send to all users
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server.'); 
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude ,coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected'); 
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}`); 
}); 

module.exports = app;