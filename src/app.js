require('dotenv').config({ path: '../config/.env' });
const express = require('express');
const path = require('path');
const appSetup = require('./utils/appSetup');

const app = express();

appSetup(app);

app.use('/api', require('./routes/api/api'));

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
