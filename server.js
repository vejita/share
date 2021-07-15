const express = require('express');
const path = require('path');
const donenv = require('dotenv').config();
const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(express.json()); // importand to resive json data "MIDDELWAARE"

const connectDB = require('./config/db');
connectDB();

// ejs engine &&&   templets

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//routs

app.use('/api/files', require('./router/file'));
app.use('/files', require('./router/show'));
app.use('/files/download', require('./router/download'));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`server is runing on ${port} .......`);
});
