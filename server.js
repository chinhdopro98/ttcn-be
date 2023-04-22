const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const dbConnection = require("./database");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const providerRoute = require("./routes/providerRoute");
const blogCategoryRoute = require("./routes/blogCategoryRoute");
const carController = require("./controller/carCtrl");
const blogCategoryController = require("./controller/blogCategoryCtrl");
const blogController = require("./controller/blogCtrl");
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
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { authMiddleware } = require("./middlewares/authMiddleware");
app.use(express.json());
app.use("/api/cars/", require("./routes/carRoute"));
app.use("/api/categorys/", require("./routes/categoryRoute"));
app.use("/api/users/", userRoute);
app.use("/api/blogs/", blogRoute);
app.use("/api/bookings/", require("./routes/bookingRoute"));
app.use("/api/automakers/", require("./routes/autoMakerRoute"));
app.use("/api/providers/", providerRoute);
app.use("/api/blog-category", blogCategoryRoute);
//car
app.use(
  "/api/cars/create",
  upload.single("image"),
  authMiddleware,
  carController.createCar
);
app.use(
  "/api/cars/update/:id",
  upload.single("image"),
  authMiddleware,
  carController.updateCar
);
//category-blog
app.use(
  "/api/blog-category/update/:id",
  upload.single("image"),
  blogCategoryController.updateCategoryBlog
);
app.use(
  "/api/blog-category/update/:id",
  upload.single("image"),
  blogCategoryController.updateCategoryBlog
);
//blog
app.use("/api/blogs/create", upload.single("image"), blogController.createBlog);

app.use(
  "/api/blogs/update/:id",
  upload.single("image"),
  blogController.updateBlog
);
app.use(notFound);
app.use(errorHandler);
app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () => console.log(`Nodejs listening on ${port}`));
