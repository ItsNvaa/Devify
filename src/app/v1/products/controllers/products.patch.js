import FilesUpload from "../../../../services/FileUpload.js";
import validator from "validator";
import Response from "../../../../utils/res.js";
import { ProductsModel, categoryMappings } from "../models/products.model.js";
import newImagePath from "../services/newImagePath.js";
import imageUrl from "../services/imageUrl.js";
import ProductsServices from "../services/ProductsServices.js";
import FileSystem from "../../../../services/FilesSystem.js";
const productsServices = new ProductsServices();
const filesUpload = new FilesUpload();
const response = new Response();
const fileSystem = new FileSystem();

//* PATCH  Products Controllers
//* PATCH Products Data / Update Products Data
export const updateProductsById = async (req, res) => {
  const { id } = req.params;
  let srcPath, oldImageCategory, oldImagePath, dstFile, newImageUrl;
  if (!validator.isNumeric(id))
    return response.unprocessable(res, "The request id is not valid");
  const category = categoryMappings[req.body.category] || null;
  await imageUrl("id", id, res, (src, oldCategory, oldPath) => {
    srcPath = src;
    oldImageCategory = oldCategory;
    oldImagePath = oldPath;
  });
  if (req.files == null) {
    newImagePath(req, category, oldImagePath, (dst, newPath) => {
      dstFile = dst;
      newImageUrl = newPath;
    });
    if (req.body.category !== undefined && category !== oldImageCategory) {
      await productsServices.updateProductsImageDirectory({
        req,
        res,
        srcPath,
        dstFile,
        model: ProductsModel,
        key: "id",
        id,
        newImageUrl,
      });
    }
    if (
      req.body.image !== undefined &&
      req.files == null &&
      req.body.category == undefined
    ) {
      await ProductsModel.findOneAndUpdate(
        { id: id },
        { ...req.body, image: req.body.image }
      );
      fileSystem.deleteFile(srcPath);
    }
    const product = await ProductsModel.findOneAndUpdate(
      { id: id },
      { ...req.body }
    );
    if (product == null) return response.notFound(res);
    response.updated(res);
  }
  if (req.files !== null) {
    let file, fileName;
    filesUpload.patch(req, res, (f, fName) => {
      file = f;
      fileName = fName;
    });
    const { url, urlPath } = productsServices.handleProductsURL({
      req,
      oldImageCategory,
      category,
      fileName,
    });
    file?.mv(urlPath, async (err) => {
      if (err) return response.unprocessable(res);
      await productsServices.updateProductsImage({
        req,
        res,
        srcPath,
        model: ProductsModel,
        key: "id",
        id,
        url,
      });
    });
  }
};

export const updateProductsByUniquekey = async (req, res) => {
  const { id } = req.params;
  let srcPath, oldImageCategory, oldImagePath, dstFile, newImageUrl;
  if (!validator.isMongoId(id))
    return response.unprocessable(res, "The request id is not a uniquekey");
  const category = categoryMappings[req.body.category] || null;
  await imageUrl("_id", id, res, (src, oldCategory, oldPath) => {
    srcPath = src;
    oldImageCategory = oldCategory;
    oldImagePath = oldPath;
  });
  if (req.files == null) {
    newImagePath(req, category, oldImagePath, (dst, newPath) => {
      dstFile = dst;
      newImageUrl = newPath;
    });
    if (req.body.category !== undefined && category !== oldImageCategory) {
      await productsServices.updateProductsImageDirectory({
        req,
        res,
        srcPath,
        dstFile,
        model: ProductsModel,
        key: "_id",
        id,
        newImageUrl,
      });
    }
    if (
      req.body.image !== undefined &&
      req.files == null &&
      req.body.category == undefined
    ) {
      await ProductsModel.findOneAndUpdate(
        { _id: id },
        { ...req.body, image: req.body.image }
      );
      fileSystem.deleteFile(srcPath);
    }
    const product = await ProductsModel.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (product == null) return response.notFound(res);
    response.updated(res);
  }
  if (req.files !== null) {
    let file, fileName;
    filesUpload.patch(req, res, (f, fName) => {
      file = f;
      fileName = fName;
    });
    const { url, urlPath } = productsServices.handleProductsURL({
      req,
      oldImageCategory,
      category,
      fileName,
    });
    file?.mv(urlPath, async (err) => {
      if (err) return response.unprocessable(res);
      await productsServices.updateProductsImage({
        req,
        res,
        srcPath,
        model: ProductsModel,
        key: "_id",
        id,
        url,
      });
    });
  }
};
