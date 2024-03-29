const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
// const validateMongoDbId = require("../utils/validateMongoDbId");
// const cloudinaryUploadImg = require("../utils/cloudinary");
const createBlog = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.file.path;
    const newBlog = await Blog.create({
      title,
      description,
      image,
      category,
    });
    res.json({
      status: "success",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;
  let updateBlog;
  try {
    if (!req.file) {
      updateBlog = await Blog.findByIdAndUpdate(
        id,
        { title, description, category },
        {
          new: true,
        }
      );
    } else {
      const image = req.file.path;
      updateBlog = await Blog.findByIdAndUpdate(
        id,
        { title, description, image, category },
        {
          new: true,
        }
      );
    }
    updateBlog = await Blog.findById(id);

    res.json({
      status: "success",
      updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// const getBlog = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);

//   try {
//     const getBlog = await Blog.findById(id)
//       .populate("likes")
//       .populate("disLikes");
//     const updateViews = await Blog.findByIdAndUpdate(
//       id,
//       { $inc: { numViews: 1 } },
//       { new: true }
//     );
//     res.json({
//       getBlog,
//       updateViews,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const getOneBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getBlog = await Blog.findById(id);
    res.json({
      getBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json({
      getBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
      status: "success",
      id: id,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// const likeBlog = asyncHandler(async (req, res) => {
//   const { blogId } = req.body;
//   validateMongoDbId(blogId);
//   const blog = await Blog.findById(blogId);
//   const loginUserId = req?.user?._id;
//   const isLiked = blog?.isLiked;
//   const alreadyDisliked = blog?.disLikes?.find(
//     (userId) => userId?.toString() === loginUserId.toString()
//   );
//   if (isLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { likes: loginUserId },
//         isLiked: false,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   } else {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $push: { likes: loginUserId },
//         isLiked: true,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   }
// });
// const disLikeBlog = asyncHandler(async (req, res) => {
//   const { blogId } = req.body;
//   validateMongoDbId(blogId);
//   const blog = await Blog.findById(blogId);
//   const loginUserId = req?.user?._id;
//   const isDisLiked = blog?.isDisLiked;
//   const alreadyLiked = blog?.likes?.find(
//     (userId) => userId?.toString() === loginUserId.toString()
//   );
//   if (alreadyLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { likes: loginUserId },
//         isLiked: false,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   }
//   if (isDisLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $pull: { disLikes: loginUserId },
//         isDisLiked: false,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   } else {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       {
//         $push: { disLikes: loginUserId },
//         isDisLiked: true,
//       },
//       { new: true }
//     );
//     res.json(blog);
//   }
// });

// const uploadImages = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       console.log(file);
//       const { path } = file;
//       const newpath = await uploader(path);
//       urls.push(newpath);
//     }
//     const findBlog = await Blog.findByIdAndUpdate(
//       id,
//       {
//         images: urls.map((file) => {
//           return file;
//         }),
//       },
//       { new: true }
//     );
//     res.json(findBlog);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

module.exports = {
  createBlog,
  getAllBlogs,
  updateBlog,
  // getBlog,
  getOneBlog,
  deleteBlog,
  // likeBlog,
  // disLikeBlog,
};
