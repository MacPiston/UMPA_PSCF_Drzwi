const express = require('express');
const app = express(), bodyParser = require("body-parser");
port = 3080;

const users = [];

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('App Works!!!!');
});

app.listen(port, () => {
    console.log(`Server listening on the port ::${port}`);
});