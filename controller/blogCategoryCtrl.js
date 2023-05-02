const BlogCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
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

const updateCategoryBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const title = req.body.title;
  const description = req.body.description;
  let updateBlogCategory;
  try {
    if (!req.file) {
      updateBlogCategory = await BlogCategory.findByIdAndUpdate(
        id,
        { title, description },
        {
          new: true,
        }
      );
    } else {
      const image = req.file.path;
      updateBlogCategory = await BlogCategory.findByIdAndUpdate(
        id,
        { title, description, image },
        {
          new: true,
        }
      );
    }
    updateBlogCategory = await BlogCategory.findById(id);
    res.json({
      status: "success",
      updateBlogCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAll = asyncHandler(async (req, res) => {
  try {
    const getCategoryBlogs = await BlogCategory.find();

    res.json({
      getCategoryBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCategoryBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteBlog = await BlogCategory.findByIdAndDelete(id);
    res.json({
      status: "success",
      id: id,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateCategoryBlog,
  deleteCategoryBlog,
  getAll,
};
