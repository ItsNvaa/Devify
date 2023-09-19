import { ProductsModel, categoryMappings } from "../models/products.model.js";
import Response from "../../../../utils/res.js";
import FilesUpload from "../../../../services/FileUpload.js";
import ProductsServices from "../services/ProductsServices.js";
const productsServices = new ProductsServices();
const filesUpload = new FilesUpload();
const response = new Response();

//* POST  Products Controllers
//* POST New Products Datas
const addProducts = (req, res) => {
  let file, fileName, url;
  filesUpload.post(req, res, (f, fName) => {
    file = f;
    fileName = fName;
  });
  const category = categoryMappings[req.body.category] || null;
  const urlPath = `./public/img/products/${category}/${fileName}`;
  if (req.body.image !== undefined) {
    if (file == null || file == undefined) {
      url = req.body.image;
      productsServices.saveProduct(req, res, ProductsModel, url);
    }
  }
  if (file !== undefined || file !== null || req.files.image.length < 2) {
    if (req.body.category == undefined)
      return response.unprocessable(res, "The category field must be filled");
    if (category == null)
      return response.unprocessable(
        res,
        "The category was not valid, Please review your input and make sure it meets the required format and criteria."
      );
    url = `${req.protocol}://${req.get(
      "host"
    )}/img/products/${category}/${fileName}`;
    file?.mv(urlPath, async (err) => {
      if (err) return response.unprocessable(res);
      productsServices.saveProduct(req, res, ProductsModel, url);
    });
  }
};

export default addProducts;
