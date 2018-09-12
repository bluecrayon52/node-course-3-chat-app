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

    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    
    jQuery('#messages').append(li); 
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault(); // stop default form behavior 

    socket.emit('createMessage', {
        from: 'User', 
        text: jQuery('[name=message]').val()
    }, function () {

    }); 
});