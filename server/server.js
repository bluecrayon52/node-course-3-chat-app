const path = require('path');
const http = require('http'); 
const express = require('express');
const socketIO = require('socket.io'); 

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express(); 
var server = http.createServer(app); 
var io = socketIO(server); 

app.use(express.static(publicPath));

// special event listener
io.on('connection', (socket) => {
    console.log('New user connected'); 

    // custom even emitter on server side sending a custom object
    socket.emit('newMessage', {
        from: 'magicMike', 
        text: 'Hey, do you even lift bro?',
        createdAt: new Date().getTime()
    }); 

    socket.on('createMessage', (message) => {
        console.log('New Message: ', message); 
    });

    socket.on('disconnect', () => {
        console.log('user disconnected'); 
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}`); 
}); 

module.exports = app;