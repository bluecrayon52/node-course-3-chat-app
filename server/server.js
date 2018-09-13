const path = require('path');
const http = require('http'); 
const express = require('express');
const socketIO = require('socket.io'); 

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users'); 

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express(); 
var server = http.createServer(app); 
var io = socketIO(server); 
var users = new Users(); 

app.use(express.static(publicPath));

//--------------------- Connection (listening to client) --------------------- 
io.on('connection', (socket) => {
    console.log('New user connected'); 

    //---------- Join Chat Room (listening to client) ----------
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id); 
        users.addUser(socket.id, params.name, params.room); 
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room)); 

        // socket.leave(params.room);
        // io.emit -> io.to('Room Name').emit 
        // socket.broadcast.emit -> socket.broadcast.to('Room Name').emit 
        // socket.emit

        //---------- emit event (to this user) ---------- 
        socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app ${params.name}! You are chatting in the ${params.room} room. Enjoy!`)); 

        //---------- emit event (to other users in the room) ---------- 
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the ${params.room} room.`)); 
        callback(); 
    });

    //---------- Create Message (listening to client) ---------- 
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id); 

        if (user && isRealString(message.text)) {
            //---------- emit event (to all users in room) ---------- 
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback('This is from the server.'); 
    });

    //---------- Create Location Message (listening to client) ---------- 
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id); 

        if (user) {
        //------------------------ emit events (to all users in room)
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude ,coords.longitude));
        }
    });

    //--------------------- Disconnection (listening to client) --------------------- 
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id); 

        if (user) {
            //------------------------ emit events (to all users)
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the ${user.room} room.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}`); 
}); 

module.exports = app;