import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';
import { Server } from 'socket.io';

import viewRouter from './routes/view.products.js';

const app = express();
const httpServer = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//path publico fue lo que me soluciono el problema
app.use(express.json());
app.use(express.static('./src/public'));

app.use('/', viewRouter);

socketServer.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log(msg);
    });

});


