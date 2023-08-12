import { User as UserMapping } from "./mapping.js";

import AppError from "../errors/AppError.js";

class User {
  async getAll() {
    const users = await UserMapping.findAll();
    return users;
  }

  async getOne(id) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error("user did not find in database");
    }
    return user;
  }

  async getByEmail(email) {
    const user = await UserMapping.findOne({ where: { email } });
    if (!user) {
      throw new Error("user did not find in database");
    }
    return user;
  }

  async create(data) {
    const { email, password, role } = data;
    const user = await UserMapping.create({ email, password, role });

    return user;
  }

  async update(id, data) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error("user did not find in database");
    }
    const {
      email = user.email,
      password = user.password,
      role = user.role,
    } = data;
    await user.update({ email, password, role });
    return user;
  }

  async update_basket(id, basket_id) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error("user did not find in database");
    }
    const basketId = basket_id;
    await user.update({ basketId });
    return user;
  }

  async delete(id) {
    const user = await UserMapping.findByPk(id);
    if (!user) {
      throw new Error("user did not find in database");
    }
    await user.destroy();
    return user;
  }
}

export default new User();
