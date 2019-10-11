const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.options('*', cors()); // enable pre-flight
app.use(bodyParser.json());
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://socket-client.jsramverk.me:443']);
// io.origins(['http://localhost:3000']);

io.on('connection', function(socket) {
    // User posted a new message - broadcast to everyone else.
    console.log(`${socket.id} is connected`);
    let user = '';

    socket.broadcast.on('SEND_MESSAGE', message => {
        console.log(message);

        io.emit('NEW_MESSAGE', {
            username: message.username,
            time: message.time,
            message: message.message
        });
    });

    // Add user to the current session
    socket.on('JOIN_CHAT', message => {
        console.log(message);
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
        console.log('disconeeencet');
        io.emit('NEW_MESSAGE', {
            time: getTime(),
            message: `${user} has left the chat`
        });
    });
});
server.listen(8300);

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
