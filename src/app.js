import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils/utils.js';
import { Server } from 'socket.io';

import viewRouter from './routes/view.products.js';

const app = express();
const httpServer = app.listen(8080, () => {
    console.log('🚀 Server is running on port 8080');
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));  // 👈 Esto está bien, mantiene acceso a los archivos públicos.

const io = new Server(httpServer);

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// Array de productos (arreglo inicial)
const productsArray = [
    { id: 1, name: 'Producto 1', price: 100 },
    { id: 2, name: 'Producto 2', price: 200 },
];

// Endpoint para renderizar la vista con los productos
app.get('/', (req, res) => {
    res.render('index', { products: productsArray });
});

// WebSockets para la comunicación en tiempo real
io.on('connection', (socket) => {
    console.log("🟢 Nuevo cliente conectado");

    // Enviar productos actuales al cliente
    socket.emit("productosActualizados", productsArray);

    // Recibir nuevos productos y agregarlos al array
    socket.on('newProduct', (data) => {
        console.log("📥 Producto recibido en el servidor:", data);

        // Verificar que los datos sean correctos
        if (!data.name || !data.price) {
            console.log("⚠ Error: Datos inválidos");
            return;
        }

        // Crear el nuevo producto
        const newProduct = {
            id: productsArray.length + 1,
            name: data.name,  // 👈 Asegurarse de usar el mismo nombre que en el cliente
            price: data.price
        };

        // Agregar al array
        productsArray.push(newProduct);
        console.log("📦 Array actualizado:", productsArray);

        // Enviar actualización a todos los clientes
        io.emit("productosActualizados", productsArray);
    });
});

// Rutas
app.use('/', viewRouter);
