//requiring the env
require('dotenv').config();

const mongoose = require('mongoose')


function connectDB() {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database connected. ');
    }).on('error', err => {
        console.log('error')
    });
}

module.exports = connectDB;


