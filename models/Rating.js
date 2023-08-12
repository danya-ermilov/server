import { Rating as RatingMapping } from "./mapping.js";
import { Product as ProductMapping } from "./mapping.js";
import { User as UserMapping } from "./mapping.js";
import AppError from "../errors/AppError.js";

class Rating {
  async get(productId, userId) {
    const rate = await RatingMapping.findOne({ where: { productId, userId } });
    if (!rate) {
      return 0;
    }
    return rate.rate;
  }

  async getOne(productId) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const votes = await RatingMapping.count({ where: { productId } });
    if (votes) {
      const rates = await RatingMapping.sum("rate", { where: { productId } });
      return { rates, votes, rating: rates / votes };
    }
    console.log(votes);
    return { rates: 0, votes: 0, rating: 0 };
  }

  async create(userId, productId, rate) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const user = await UserMapping.findByPk(userId);
    if (!user) {
      throw new Error("Пользователь не найден в БД");
    }
    const rating1 = await RatingMapping.create({ userId, productId, rate });
    const rated = await this.getOne(productId);
    const rating = rated.rating;
    await product.update({ rating });
    return rating;
  }

  async delete(userId, productId) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    const user = await UserMapping.findByPk(userId);
    if (!user) {
      throw new Error("Пользователь не найден в БД");
    }
    const rating1 = await RatingMapping.destroy({
      where: { userId, productId },
    });
    const rated = await this.getOne(productId);
    const rating = rated.rating;
    await product.update({ rating });
    return rating;
  }
}

export default new Rating();
