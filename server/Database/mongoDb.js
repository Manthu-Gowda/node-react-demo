
const mongoose = require("mongoose");

async function db() {
  try {
    await mongoose.connect('mongodb+srv://kmanthugowda:Manthu%40420@nodereactdemo.veoscsu.mongodb.net/?retryWrites=true&w=majority');

    mongoose.connection.on("connected", () => {
      console.log("🟢 Mongoose connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🔴 Mongoose connection error:", err);
    });
  } catch (err) {
    throw new Error("MongoDB connection failed: " + err.message);
  }
}

module.exports = db;
