const express = require("express");
const { createBlogCategory } = require("../controller/blogCategoryCtrl");

const router = express.Router();

// router.post("/create", upload.single("image"), createBlogCategory);
module.exports = router;
