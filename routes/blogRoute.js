const express = require("express");
const {
  createBlog,
  getAllBlogs,
  deleteBlog,
  getOneBlog,
  // updateBlog,
  // getBlog,
  // getAllBlogs,
  // deleteBlog,
  // likeBlog,
  // disLikeBlog,
  // uploadImages,
} = require("../controller/blogCtrl");
// const { authMiddleware } = require("../middlewares/authMiddleware");
// const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

const router = express.Router();
// router.get("/get/:id", authMiddleware, isAdmin, getBlog);
router.get("/get-all", getAllBlogs);
router.delete("/delete/:id", deleteBlog);
router.get("/get-one/:id", getOneBlog);
// router.put("/likes", authMiddleware, isAdmin, likeBlog);
// router.put("/dislikes", authMiddleware, isAdmin, disLikeBlog);
module.exports = router;
