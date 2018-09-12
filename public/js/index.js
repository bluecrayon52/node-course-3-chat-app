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

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    // clickable link
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    // link url 
    a.attr('href', message.url); 
    li.append(a); 
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

// click listener for send location button 
var locationButton = jQuery('#send-location'); 
locationButton.on('click', function () {
    // check access to geolocation API 
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.'); 
    }

    // try to fetch user location 
    navigator.geolocation.getCurrentPosition(function (position) {
        // success 
        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude  
        });
        // fail 
    }, function () {
        alert('Unable to fetch location.');
    });
});