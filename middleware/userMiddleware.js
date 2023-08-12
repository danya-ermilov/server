import AppError from "../errors/AppError.js";
import UserModel from "../models/User.js";

async function func(req, next) {
  let result = await UserModel.getOne(req.params.id); // будет ждать, пока промис не выполнится (*)
  let id = result.dataValues.id; // "готово!"
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

const user = (req, res, next) => {
  func(req, next);
  //console.log(req.params, req.auth.id, product);
};

export default user;
