const express = require('express');
const http = require('http');
const app = express();
const path = require('path');

const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', onConnected);

let totalClients = 0;

function onConnected(socket) {
    console.log('User connected with id = ', socket.id);
    ++totalClients;
    io.emit('changeNumberOfClients', totalClients);

    socket.on('disconnect', () => {
        console.log('User with id = ', socket.id, 'disconnected');
        --totalClients;
        io.emit('changeNumberOfClients', totalClients);
    });

    socket.on('message', data => {
        console.log('data', data);
        // send to all except me
        socket.broadcast.emit('send-msg', data);
        console.log('msg sent successfully!');
    });

    socket.on('typing', () => {
        socket.broadcast.emit('show-typing-status');
    });

    socket.on('stopped-typing', () => {
        socket.broadcast.emit('hide-typing-status');
    });

}

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listining on port ${port}`);
});