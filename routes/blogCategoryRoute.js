const express = require("express");
const {
  createBlogCategory,
  getAll,
  updateCategoryBlog,
  deleteCategoryBlog,
} = require("../controller/blogCategoryCtrl");

const router = express.Router();
router.get("/get-all", getAll);
router.delete("/delete/:id", deleteCategoryBlog);
module.exports = router;
