const express = require('express');
const dotenv = require('dotenv');
const { products } = require('./database');

dotenv.config();

const app = express();

// Configuraciones básicas de Express
app.use(express.json()); // Permite que el body de la petición sea en JSON.

// NOTA: Se especifica extendend: false, para usar internamente una librería
// que se llama querystring
app.use(express.urlencoded({ extended: false })) // Permitir el uso de querystrings

// ¿Qué es un querystring?
// https://www.youtube.com    /watch      ? v = mE9SfYqbawo
//        dominio            ruta, URI       querystring (v = mE9SfYqbawo)
// https://www.youtube.com   /watch       ? v = Vg4CL6GmvrU
//        dominio            ruta, URI       querystring (v = Vg4CL6GmvrU)

// https://www.google.com
// /maps/place
// /Instituto+de+Psicoterapia+y+Salud+Integral+Psicologo+Pachuca <- Query Params
// ?entry = ttu <-Query String

// https://www.google.com/search
// ?q=mujer+digital
// &sca_esv=d16ee049f4f490b7
// &sca_upv=1&sxsrf=ACQVn08rQcvbBB4Yw5n5TUqySwnvFTRwLA%3A1708022977663
// &source=hp
// &ei=wVzOZZLuJe6fur8P1YuWsA0
// &iflsig=ANes7DEAAAAAZc5q0ZpYTiba38X77ZEbq0DqIJQJm6Hy&oq=mujer&gs_lp=Egdnd3Mtd2l6IgVtdWplcioCCAAyChAjGIAEGIoFGCcyChAjGIAEGIoFGCcyCBAAGIAEGLEDMg4QABiABBiKBRixAxiDATIIEC4YgAQYsQMyBRAAGIAEMggQABiABBixAzILEC4YgAQYsQMY1AIyBRAAGIAEMg4QABiABBiKBRixAxiDAUiGDFC4AliRBnABeACQAQCYAX2gAcsEqgEDMC41uAEDyAEA-AEBqAIKwgIHECMY6gIYJ8ICDRAuGMcBGK8BGOoCGCfCAgsQABiABBixAxiDAcICERAuGIAEGLEDGIMBGMcBGNEDwgIOEC4YgAQYigUYsQMYgwHCAhEQLhiDARjUAhixAxiABBiKBcICDhAuGIAEGMcBGK8BGI4FwgIUEC4YgAQYsQMYgwEYxwEYrwEYjgXCAhEQLhiABBixAxjHARivARiOBQ&sclient=gws-wiz

// Query Params -> Buscar un elemento mediante un identificador
// Query String -> Añadir filtros a la petición

// getMany(), find()
app.get('/products', function(req, res) {
    return res.status(200).json(products);
});

// Endpoint dinámico -> Recibimos una variable (id) en la URL
// de la petición (Query Params), y dependiendo del valor
// vamos a obtener una respuesta diferente

// getOne(), findOne()
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

app.post('/products', function(req, res) {
    const data = req.body;
    // TODO: Hacer validaciones
    // 1. Que req.body es un objeto
    // 2. Que el id esté presente
    // 3. Que el id no sea 0
    // 4. Que el id no sea uno de los ya existentes
    // 5. Que el id sea numérico
    // 6. Que el name esté presente.
    // 7. Que el nombre sea string
    // 8. Que el nombre tenga al menos 3 caracteres
    // 9. Que el nombre no exceda los 140 caracteres.
    // 10. Que el precio esté presente
    // 10. Que el precio numérico y mayor a 0
    // 11. Que la descripción, si es que está presente, sea string,
    // 12. Que la cantidadDisponible, si es que está presente, que sea numérico y mayor 0.
    // 13. Que la marca esté presente
    // 14. Que la marca sea string.
    // 15. Que la categoría esté presente
    // 16. Que la categoría sea string. 

    products.push(data);
    return res.status(201).json(products);
});
// GET - POST - PUT - PATCH - DELETE <- Métodos HTTP 
app.put('/products/:id', function(req, res) {
    const { id } = req.params;
    const productIndex = products.findIndex(function (product) {
        return product.id === +id;
    });

    if (productIndex === -1) {
        return res.status(404).json({
            message: 'El producto solicitado no existe'
        })
    }

    const product = products[productIndex];
    const newProduct = req.body;

    // Sobreescritura
    const updatedProduct = Object.assign(product, newProduct);

    // Acrualizamos el arreglo
    products[productIndex] = updatedProduct;

    return res.status(200).json(products);
});

app.delete('/products/:id', function(req, res) {
    console.log('HOLA!')
    const { id } = req.params;

    const productIndex = products.findIndex(function(product) {
        return product.id === Number(id)
    });

    if (productIndex === -1) {
        return res.status(404).json({
            message: 'No se encontró el producto con el ID: ' + id
        })
    }

    // Eliminamos el productos
    // eliminamos la información del arreglo, por el índice
    products.splice(productIndex, 1);

    return res.status(200).json(products);
});


app.get('/', function(req, res) {
    return res.status(200).json({ message: 'Hola Mundo! Mujer Digital!' });
});

const port = process.env.PORT;

app.listen(port, function() {
    console.log(`La API está corriendo en el puerto ${port}`);
});