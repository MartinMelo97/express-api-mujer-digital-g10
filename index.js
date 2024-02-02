const express = require('express');
const app = express();

app.get('/', function(req, res) {
    return res.status(200).json({ message: 'Hola Mundo! MD' });
});

app.listen(8000, function() {
    console.log('La API está corriendo en el puerto 8000');
});