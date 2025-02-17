const socket = io();

socket.emit('message', 'Hello World!');

document.getElementById('formMain').addEventListener('submit', (e) => {
    e.preventDefault();

    const nameProduct = document.getElementById('productName').value;
    const price = document.getElementById('price').value;

    const newProduct = {nameProduct,price};

    socket.emit('newProduct', newProduct);
});
