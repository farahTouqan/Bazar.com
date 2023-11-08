const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const PORT = process.env.PORT || 4000;
const catalog = [];
const orderCsvWriter = createCsvWriter({
    path: 'order.csv',
    header: [
        { id: 'orderId', title: 'OrderID' },
        { id: 'itemName', title: 'ItemName' },
        { id: 'itemPrice', title: 'ItemPrice' },
    ],
    append: true, // Append data to the file
});
let orderIdCounter = 1; // Default initial value

// Read the order.csv file to find the maximum order ID
fs.createReadStream('order.csv')
    .pipe(csv())
    .on('data', (row) => {
        const orderId = parseInt(row.id);
        if (!isNaN(orderId) && orderId >= orderIdCounter) {
            orderIdCounter = orderId + 1;
        }
    })
    .on('end', () => {
        console.log('Initial orderIdCounter:', orderIdCounter);
        // You can now use orderIdCounter with the updated initial value.
    })
    .on('error', (error) => {
        console.error(error);
    });

// Read items from the catalog.csv file
fs.createReadStream('catalog.csv')
    .pipe(csv({ columns: true }))
    .on('data', (data) => {
        catalog.push(data);
    })
    .on('end', () => {
        console.log('Catalog:', catalog);
    })
    .on('error', (error) => {
        console.error(error);
    });

app.get('/CATALOG_WEBSERVICE_IP/catalog', (req, response) => {
    return response.json(catalog);
});

app.get('/CATALOG_WEBSERVICE_IP/buy/:itemID', (req, response) => {
    const itemID = req.params.itemID;
    const item = catalog.find((item) => item.id === itemID);

    if (!item) {
        return response.status(404).send('Item not found');
    }

    const order = {
        orderId: orderIdCounter,
        itemName: item.title,
        itemPrice: item.price,
    };
    orderIdCounter++;

    item.quantity--;
    const csvWriter = createCsvWriter({
        path: 'catalog.csv',
        header: [
            { id: 'id', title: 'id' },
            { id: 'price', title: 'price' },
            { id: 'title', title: 'title' },
            { id: 'quantity', title: 'quantity' },
            { id: 'topic', title: 'topic' }
        ]
    });
    csvWriter
        .writeRecords(catalog)
        .then(() => console.log(''));

    orderCsvWriter
        .writeRecords([order])
        .then(() => {
            console.log('Order placed:', order);
            return response.json(order);
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
sssss