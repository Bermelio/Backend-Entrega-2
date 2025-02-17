import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';
import { Server } from 'socket.io';


import viewRouter from './routes/view.products.js';

const app = express();
const httpServer = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use('/', viewRouter);

//path publico fue lo que me soluciono el problema
app.use(express.json());
app.use(express.static('./src/public'));

const productsArray = [];

io.on("connection", (socket) => {
    console.log("* * * New User * * *");

    socket.emit("productsList", productsArray);

    socket.on("nuevoProducto", (product) => {
        product.id = productsArray.length + 1;
        productsArray.push(product);
        io.emit("productosActualizados", productsArray);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});
