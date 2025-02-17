const socket = io();

socket.emit('message', 'Hello World!');

document.getElementById('formMain').addEventListener('submit', (e) => {
    e.preventDefault();
});

const btnSend = document.getElementById('send');

btnSend.addEventListener('click', () => {
    const inputProductName = document.getElementById('productName');
    const inputPrice = document.getElementById('price');

    const productName = inputProductName.value;
    const price = inputPrice.value;
    
    console.log("🛒 Producto ingresado:", productName, "💰 Precio:", price);

    inputProductName.value = '';
    inputPrice.value = '';


    const newProduct = { name: productName, price };

    console.log("📦 Objeto enviado al servidor:", newProduct);

    socket.emit('newProduct', newProduct);
});
