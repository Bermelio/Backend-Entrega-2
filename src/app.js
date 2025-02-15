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
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/../views');

app.use(express.static(__dirname + '/public'));

app.use('/', viewRouter);