const BlogCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const title = req.body.title;
    const description = req.body.description;
    const image = req.file.path;
    const newBlogCategory = await BlogCategory.create({
      title,
      description,
      image,
    });
    res.json({
      status: "success",
      newBlogCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBlogCategory,
};
