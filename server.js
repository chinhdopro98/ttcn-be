const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const dbConnection = require("./database");
const userRouter = require("./routes/userRoute");
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Accept, Authorization"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
const { notFound, errorHandler } = require("./middlewares/errorHandler");
app.use(express.json());
app.use("/api/cars/", require("./routes/carRoute"));
app.use("/api/categorys/", require("./routes/categoryRoute"));
app.use("/api/users/", userRouter);
app.use("/api/bookings/", require("./routes/bookingRoute"));
app.use("/api/automakers/", require("./routes/autoMakerRoute"));
app.use(notFound);
app.use(errorHandler);
app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () => console.log(`Nodejs listening on ${port}`));
