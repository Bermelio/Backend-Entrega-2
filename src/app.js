import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';
import { Server } from 'socket.io';

import viewRouter from './routes/view.products.js';

const app = express();
const httpServer = app.listen(8080, () => {
    console.log('🚀 Server is running on port 8080');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public')); 

const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

const productsArray = [
    { id: 1, name: 'Producto 1', price: 100 },
    { id: 2, name: 'Producto 2', price: 200 },
];

app.get('/', (req, res) => {
    res.render('index', { products: productsArray });
});

io.on('connection', (socket) => {
    console.log("🟢 Nuevo cliente conectado");

    socket.emit("productosActualizados", productsArray);

    socket.on('newProduct', (data) => {
        console.log("📥 Producto recibido en el servidor:", data);

        if (!data.name || !data.price) {
            console.log("⚠ Error: Datos inválidos");
            return;
        }

        const newProduct = {
            id: productsArray.length + 1,
            name: data.name,
            price: data.price
        };

        productsArray.push(newProduct);
        console.log("📦 Array actualizado:", productsArray);

        io.emit("productosActualizados", productsArray);
    });
});

app.use('/', viewRouter);
