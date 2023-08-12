import BasketModel from "../models/Basket.js";
import ProductModel from "../models/Product.js";
import AppError from "../errors/AppError.js";
import UserModel from "../models/User.js";

class Basket {
  async create(req, res, next) {
    try {
      let basket;
      basket = await BasketModel.create(req.auth.id);
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
  async getOne(req, res, next) {
    try {
      let basket;
      let user;
      const result = await UserModel.getOne(req.auth.id);
      let id = result.dataValues.basketId;
      if (id) {
        basket = await BasketModel.getOne(id);
      } else {
        basket = await BasketModel.create(req.auth.id);
        user = await UserModel.update_basket(req.auth.id, basket.dataValues.id);
      }
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async append(req, res, next) {
    try {
      let basket;
      let user;
      const result = await UserModel.getOne(req.auth.id);
      //console.log(result.dataValues);
      let id = result.dataValues.basketId;
      if (id) {
        console.log(id);
        //basket = await BasketModel.getOne(id);
      } else {
        basket = await BasketModel.create(req.auth.id);
        user = await UserModel.update_basket(
          req.auth.id,
          basket.dataValues.basketId
        );
      }
      const { productId } = req.params;
      basket = await BasketModel.append(id, productId, 1);
      //res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async remove(req, res, next) {
    try {
      let basket;
      let user;
      const result = await UserModel.getOne(req.auth.id);
      let id = result.dataValues.basketId;
      //console.log(id);
      if (id) {
        console.log(id);
        //basket = await BasketModel.getOne(id);
      } else {
        basket = await BasketModel.create(req.auth.id);
        user = await UserModel.update_basket(
          req.auth.id,
          basket.dataValues.basketId
        );
      }
      basket = await BasketModel.remove(id, req.params.productId);
      //res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async clear(req, res, next) {
    try {
      let basket;
      let user;
      const result = await UserModel.getOne(req.auth.id);
      let id = result.dataValues.basketId;
      if (id) {
        console.log(id);
        //basket = await BasketModel.getOne(id);
      } else {
        basket = await BasketModel.create(req.auth.id);
        user = await UserModel.update_basket(
          req.auth.id,
          basket.dataValues.basketId
        );
      }
      basket = await BasketModel.clear(id);
      //res.cookie("basketId", basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Basket();
