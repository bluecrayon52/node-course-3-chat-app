var socket = io();

function scrollToBottom () {
    // selectors 
    var messages = jQuery('#messages'); 
    var newMessage = messages.children('li:last-child');
    // heights 
    var clientHeight = messages.prop('clientHeight'); 
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();  

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    } 
}

socket.on('connect', function () {
    //--------------------------- Join Chat Room (emit to server) ---------------------------
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err); 
            window.location.href ='/';
        } else {
            console.log('No error'); 
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server'); 
});

// ---------------------------Update User List (listening to server) ----------------------
socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol); 
}); 

//--------------------------- new Message (listening to server) ---------------------------
socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html(); 
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from, 
        createdAt: formattedTime
    }); 
    jQuery('#messages').append(html);
    scrollToBottom(); 
});

//--------------------------- new Location Message (listening to server)---------------------------
socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html(); 
    var html = Mustache.render(template, {
        from: message.from, 
        createdAt: formattedTime,
        url: message.url
    }); 
    jQuery('#messages').append(html); 
    scrollToBottom(); 
});

//--------------------------- Submit Message (listening to DOM) ---------------------------
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault(); // stop default form behavior 
    var messageTextbox = jQuery('[name=message]');

    //---------- emit event (to server) ----------
    socket.emit('createMessage', {
        from: 'User', 
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val(''); // wipe the box
    }); 
});

//--------------------------- Share Location (listening to DOM) ---------------------------
var locationButton = jQuery('#send-location'); 
locationButton.on('click', function () {
    // check access to geolocation API 
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.'); 
    }

    // disable button after initial click and mod text
    locationButton.attr('disabled', 'disabled').text('Sending location...'); 

    // try to fetch user location 
    navigator.geolocation.getCurrentPosition(function (position) {
        // success 
        // reset button
        locationButton.removeAttr('disabled').text('Send location'); 

        //---------- emit event (to server) ----------
        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude  
        });
        // fail 
    }, function () {
        locationButton.removeAttr('disabled').text('Send location'); 
        alert('Unable to fetch location.');
    });
});