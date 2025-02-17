const socket = io();

socket.emit('message', 'Hello World!');