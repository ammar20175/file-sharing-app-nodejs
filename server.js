const express = require('express');

const path = require('path');

const app = express();

const cors = require('cors');
//for paring data
app.use(express.json());
//template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//setting up static view
app.use(express.static('public'))

const PORT = process.env.PORT || 3000;

//importing database connection from /config/db.js
const connectDB = require('./config/db');
connectDB();


//cors

const corsOption = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}

app.use(cors(corsOption));

//using routes for /routes/files.js
app.use('/api/files', require('./routes/files'));

//using routes for /routes/show.js
app.use('/files', require('./routes/show'));

app.use('/files/download', require('./routes/download'));


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})