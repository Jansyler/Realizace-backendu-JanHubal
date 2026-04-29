const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

function readFiles(fileName) {
    try {
        let rawdata = fs.readFileSync(fileName + '.json');
        return JSON.parse(rawdata);
    } catch (err) {
        return [];
    }
}

function writeFiles(fileName, data) {
    let stringData = JSON.stringify(data, null, 2);
    fs.writeFileSync(fileName + '.json', stringData);
}

app.post('/shop', (req, res) => {
    let shops = readFiles('shops');

    let newShop = {
        id: crypto.randomUUID(),
        name: req.body.name,
        url: req.body.url
    };

    shops.push(newShop);
    writeFiles('shops', shops);

    res.status(201).send(newShop);
});

app.get('/shop', (req, res) => {
    let shops = readFiles('shops');
    res.send(shops);
});

app.put('/shop/:id', (req, res) => {
    let shops = readFiles('shops');
    let shopId = req.params.id;

    let foundIndex = -1;
    for (let i = 0; i < shops.length; i++) {
        if (shops[i].id === shopId) {
            foundIndex = i;
        }
    }

    if (foundIndex === -1) {
        res.status(404).send("Shop not found");
        return;
    }

    if (req.body.name) {
        shops[foundIndex].name = req.body.name;
    }
    if (req.body.url) {
        shops[foundIndex].url = req.body.url;
    }

    writeFiles('shops', shops);
    res.send(shops[foundIndex]);
});

app.delete('/shop/:id', (req, res) => {
    let shops = readFiles('shops');
    let newShops = [];

    for (let i = 0; i < shops.length; i++) {
        if (shops[i].id !== req.params.id) {
            newShops.push(shops[i]);
        }
    }

    writeFiles('shops', newShops);
    res.send("Deleted");
});

app.post('/product', (req, res) => {
    let products = readFiles('products');

    let offersArray = [];
    if (req.body.offers) {
        offersArray = req.body.offers;
    }

    let newProduct = {
        id: crypto.randomUUID(),
        modelName: req.body.modelName,
        category: req.body.category,
        offers: offersArray
    };

    products.push(newProduct);
    writeFiles('products', products);

    res.status(201).send(newProduct);
});

app.get('/product', (req, res) => {
    let products = readFiles('products');
    let searchQuery = req.query.search;

    if (searchQuery) {
        let filteredProducts = [];
        for (let i = 0; i < products.length; i++) {
            let name = products[i].modelName.toLowerCase();
            if (name.includes(searchQuery.toLowerCase())) {
                filteredProducts.push(products[i]);
            }
        }
        res.send(filteredProducts);
    } else {
        res.send(products);
    }
});

app.put('/product/:id', (req, res) => {
    let products = readFiles('products');

    let foundIndex = -1;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === req.params.id) {
            foundIndex = i;
        }
    }

    if (foundIndex === -1) {
        res.status(404).send("Product not found");
        return;
    }

    if (req.body.modelName) {
        products[foundIndex].modelName = req.body.modelName;
    }
    if (req.body.category) {
        products[foundIndex].category = req.body.category;
    }
    if (req.body.offers) {
        products[foundIndex].offers = req.body.offers;
    }

    writeFiles('products', products);
    res.send(products[foundIndex]);
});

app.delete('/product/:id', (req, res) => {
    let products = readFiles('products');
    let newProducts = [];

    for (let i = 0; i < products.length; i++) {
        if (products[i].id !== req.params.id) {
            newProducts.push(products[i]);
        }
    }

    writeFiles('products', newProducts);
    res.send("Deleted");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
