const express = require('express');
const dotenv = require('dotenv');
const { products } = require('./database');

dotenv.config();

const app = express();

app.get('/products', function(req, res) {
    return res.status(200).json(products);
});

app.get('/products/:id', function(req, res) {
    const { id } = req.params;
    const product = products.find(function (product) {
        return product.id === +id;
    });

    if (!product) {
        return res.status(404).json({
            message: 'El producto solicitado no existe'
        })
    }

    return res.status(200).json(product)
});


app.get('/', function(req, res) {
    return res.status(200).json({ message: 'Hola Mundo! Mujer Digital' });
});

const port = process.env.PORT;

app.listen(port, function() {
    console.log(`La API está corriendo en el puerto ${port}`);
});