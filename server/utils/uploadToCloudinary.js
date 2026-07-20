import cloudinary from "../configs/cloudinary.js";

const uploadToCloudinary = async (fileBuffer, folder = "easybook") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

export default uploadToCloudinary;