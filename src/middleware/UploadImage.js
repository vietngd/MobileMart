//Upload ảnh lên cloudinary
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

const cloud_name = process.env.CLOUDINARY_NAME;
const api_key = process.env.CLOUDINARY_KEY;
const api_secret = process.env.CLOUDINARY_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
  folder: "mobimart_img",
};

const uploadImage = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

const uploadMultipleImages = (images) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadImage(base));
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};

const UploadImageMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { product, sliders } = req.body;
      if (product) {
        const imgUrls = await uploadMultipleImages(product?.images);
        req.body.images = imgUrls;
      }
      if (sliders) {
        const imgUrls = await uploadMultipleImages(sliders);
        req.body.images = imgUrls;
      }
      next();
    } catch (err) {
      return res.status(500).json({
        status: err,
        message: "Upload ảnh thất bại",
      });
    }
  };
};

module.exports = UploadImageMiddleware;
