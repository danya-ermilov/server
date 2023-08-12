import AppError from "../errors/AppError.js";
import ProductModel from "../models/Product.js";

async function func(req, next) {
  let result = await ProductModel.getOne(req.params.id); // будет ждать, пока промис не выполнится (*)
  let id = result.dataValues.userId; // "готово!"
  //console.log(result, id, req.auth.id);
  try {
    if (req.auth.role !== "ADMIN" && id != req.auth.id) {
      throw new Error("no access");
    }
    next();
  } catch (e) {
    next(AppError.forbidden(e.message));
  }
}

const product = (req, res, next) => {
  func(req, next);
  //console.log(req.params, req.auth.id, product);
};

export default product;
