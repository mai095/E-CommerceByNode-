import multer, { diskStorage } from "multer";

export const fileUpload = () => {
  const filefilter = (req, file, cb) => {
    if (!["image/png", "image/jpeg"].includes(file.mimetype))
      return cb(new Error("Invalid Image"), false);
    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), filefilter });
};
