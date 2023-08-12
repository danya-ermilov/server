import { Comment as CommentMapping } from "./mapping.js";
import { Product as ProductMapping } from "./mapping.js";
import { User as UserMapping } from "./mapping.js";
import AppError from "../errors/AppError.js";

class Comment {
  async getOne(id) {
    const comment = await CommentMapping.findByPk(id);
    if (!comment) {
      throw new Error("Comment не найден в БД");
    }
    return comment;
  }

  async get(productId) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("product is not in db");
    }
    const comment = await CommentMapping.findAndCountAll({
      where: { productId },
    });
    if (!comment) {
      return 0;
    }
    return comment;
  }

  async create(productId, userId, text) {
    const product = await ProductMapping.findByPk(productId);
    if (!product) {
      throw new Error("product is not in db");
    }
    const user = await UserMapping.findByPk(userId);
    if (!user) {
      throw new Error("user is not in db");
    }
    const comment = await CommentMapping.create({ productId, userId, text });
    return comment;
  }

  async update(id, text) {
    const comment = await CommentMapping.findByPk(id);
    if (!comment) {
      throw new Error("comment не найден в БД");
    }
    await comment.update({ text });
    return comment;
  }

  async delete(id) {
    const comment = await CommentMapping.findByPk(id);
    if (!comment) {
      throw new Error("comment не найден в БД");
    }
    await comment.destroy();
    return comment;
  }
}

export default new Comment();
