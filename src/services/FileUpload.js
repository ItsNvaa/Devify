import path from "path";
import imageExt from "../utils/imageExtension.js";
import Response from "../utils/res.js";
const response = new Response();
// import createLogger from "../utils/logger.js";
// const logger = createLogger();

class FilesUpload {
  post = function (req, res, files) {
    let file, fileExt;
    if (req.files !== null) {
      if (req.files.image?.length > 1)
        return response.unprocessable(
          res,
          "Multiple images upload does not supported"
        );
      file = req.files.image;
      file?.name !== undefined ? (fileExt = path.extname(file.name)) : null;
      const fileName = file?.md5 + fileExt;
      if (req.files.image?.size > 5000000)
        return response.unprocessable(
          res,
          "The image size must be less than 5mb"
        );
      if (req.files.image !== undefined || req.files.image !== null) {
        if (!imageExt.includes(fileExt?.toLowerCase()))
          return response.unprocessable(
            res,
            "Images extension does not supported."
          );
      }
      files(file, fileName);
    }
  };
  patch = function (req, res, files) {
    let file, fileExt, fileName;
    if (req.files !== null) {
      if (req.files.image.length > 1)
        return response.unprocessable(
          res,
          "Multiple images upload does not supported"
        );
      const f = req.files.image;
      f?.name !== undefined ? (fileExt = path.extname(f.name)) : null;
      const fName = f.md5 + fileExt;
      if (req.files.image.size > 5000000)
        return response.unprocessable(
          res,
          "The image size must be less than 5mb"
        );
      if (!imageExt.includes(fileExt?.toLowerCase()))
        return response.unprocessable(
          res,
          "Images extension does not supported."
        );
      file = f;
      fileName = fName;
      files(file, fileName);
    }
  };
  delete = function () {};
}

export default FilesUpload;
