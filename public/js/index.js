var socket = io();
socket.on('connect', function () {
    console.log('Connected to server'); 
});

socket.on('disconnect', function () {
    console.log('Disconnected from server'); 
});

// custom event listener on client side 
socket.on('newMessage', function (message) {
    console.log('New Message: ', message); 
});