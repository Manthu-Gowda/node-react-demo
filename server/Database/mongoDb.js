const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/mydatabase');

async function db(){
   await mongoose.connect('mongodb://localhost:27017/mydatabase');
   console.log('Connected to MongoDB');
}

module.exports = db;