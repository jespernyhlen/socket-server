const express = require('express');
const app = express();

let server = app.listen(8300, function() {
    console.log('server is running on port 8300');
});

let socket = require('socket.io');
let io = socket(server);

io.origins(['https://jespernyhlenjs.me:443']);
// io.origins(['http://localhost:3000']);

io.on('connection', function(socket) {
    // User posted a new message - broadcast to everyone else.
    console.log(`${socket.id} is connected`);
    let user = '';

    socket.on('SEND_MESSAGE', message => {
        // console.log(message);
        io.emit('NEW_MESSAGE', {
            username: message.username,
            time: message.time,
            message: message.message
        });
    });

    // Add user to the current session
    socket.on('JOIN_CHAT', message => {
        // console.log(message);
        user = message.username;
        //Echo to everyone that the user has connected.
        io.emit('NEW_MESSAGE', {
            // username: message.username,
            time: message.time,
            message: message.message
        });
    });

    // When the user disconnects
    // socket.on('disconnect', () => {
    socket.on('LEAVE_CHAT', message => {
        //Echo to everyone that the user has disconnected.
        io.emit('NEW_MESSAGE', {
            time: message.time,
            message: message.message
        });
    });

    socket.on('disconnect', () => {
        if (user !== '') {
            io.emit('NEW_MESSAGE', {
                time: getTime(),
                message: `${user} has left the chat`
            });
        }
    });
});

getTime = () => {
    let today = new Date();
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    let month = months[today.getMonth()];
    let day = ('0' + today.getDate()).slice(-2);

    let time =
        ('0' + today.getHours()).slice(-2) +
        ':' +
        ('0' + today.getMinutes()).slice(-2);

    return month + ' ' + day + ' ' + time;
};
