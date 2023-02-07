const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect("mongodb://localhost:27017/Car", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const connection = mongoose.connection;

  connection.on("connected", () => {
    console.log("Mongoose DB Connetion Succesfull");
  });

  connection.on("error", () => {
    console.log("Mongoose DB Connetion Erorr");
  });
}
connectDB();

module.exports = mongoose;
