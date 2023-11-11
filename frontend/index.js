const express = require('express');
const app = express();
//const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const http = require('http');

const PORT = process.env.PORT || 4001;
const catalog = [];
let info = [];
let purchase;


app.get('/CATALOG_WEBSERVICE_IP/search/:itemName', (req, response) => {
    let data = [];
    http.get(`http://10.0.2.5:4000/CATALOG_WEBSERVICE_IP/find/${req.params.itemName}`, (res) => {
        res.on('data', (chunk) => {
            data.push(chunk);
        });
        res.on('end', () => {
            if (data.toString() === "0") {
                info = "the book is no found";
            }
            else {
                info = data.join(''); // Concatenate the chunks into a single string
            }

            console.log("info = ", info);
            response.send(info); // Use the 'response' object here
        });
    })
        .on('error', (error) => {
            console.log(error);
            response.status(500).send('Internal Server Error'); // Handle errors and send an appropriate response
        });
});



app.get('/CATALOG_WEBSERVICE_IP/pruchase/:itemNUM', (req, response) => {
    let data = [];
    http.get(`http://10.0.2.4:4000/CATALOG_WEBSERVICE_IP/buy/${req.params.itemNUM}`, (res) => {
        res.on('data', (chunk) => {
            data.push(chunk);
        });
        res.on('end', () => {
            purchase = data;
            if (data.toString() === "0") {
                info = "the book is no found";
            }
            else {
                info = data.join(''); // Concatenate the chunks into a single string
            }

            console.log("info = ", info);
            response.send(info); // Use the 'response' object here
        });
    })
        .on('error', (error) => {
            console.log(error);
            response.status(500).send('Internal Server Error'); // Handle errors and send an appropriate response
        });

});


app.get('/CATALOG_WEBSERVICE_IP/info/:itemNUM', (req, response) => {
    let data = [];

    http.get(`http://10.0.2.5:4000/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {
        res.on('data', (chunk) => {
            data.push(chunk);
        });

        res.on('end', () => {
            if (data.toString() === "0") {
                info = "the book is not found";
            } else {
                info = data.join(''); // Concatenate the chunks into a single string
            }

            console.log("info = ", info);
            response.send(info); // Use the 'response' object here
        });
    })
        .on('error', (error) => {
            console.log(error);
            response.status(500).send('Internal Server Error'); // Handle errors and send an appropriate response
        });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});