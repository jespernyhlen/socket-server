var express = require('express');
var app = express();

let server = app.listen(8300, function() {
    console.log('server is running on port 8300');
});

var socket = require('socket.io');
let io = socket(server);

io.origins(['https://jespernyhlenjs.me:443']);

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data) {
        io.emit('RECEIVE_MESSAGE', data);
    });

    socket.on('JOIN_CHAT', function(data) {
        io.emit('RECEIVE_JOIN_MESSAGE', data);
    });

    socket.on('LEAVE_CHAT', function(data) {
        io.emit('RECEIVE_LEAVE_MESSAGE', data);
    });
});
