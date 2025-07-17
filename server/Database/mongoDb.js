const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/mydatabase');

async function db(){
   await mongoose.connect('mongodb+srv://kmanthugowda:Manthu%40420@nodereactdemo.veoscsu.mongodb.net/?retryWrites=true&w=majority');
   console.log('Connected to MongoDB');
}

module.exports = db;