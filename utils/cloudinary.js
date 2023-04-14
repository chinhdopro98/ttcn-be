const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dpojrsjyd",
  api_key: "789787871371232",
  api_secret: "e4FSVjsE3Yyhl8Ncy9yWV55fkn4",
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      resolve(
        {
          url: result.secure_url,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = cloudinaryUploadImg;
