import AppError from "../errors/AppError.js";
import CommentModel from "../models/Comment.js";

async function func(req, next) {
  //console.log(req.params);
  let result = await CommentModel.getOne(req.params.id); // будет ждать, пока промис не выполнится (*)
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
};

export default product;
