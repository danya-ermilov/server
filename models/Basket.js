import { Basket as BasketMapping } from "./mapping.js";
import { Product as ProductMapping } from "./mapping.js";
import { BasketProduct as BasketProductMapping } from "./mapping.js";
import AppError from "../errors/AppError.js";

const pretty = (basket) => {
  const data = {};
  data.id = basket.id;
  data.products = [];
  if (basket.products) {
    data.products = basket.products.map((item) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.basket_product.quantity,
        image: item.image,
      };
    });
  }
  return data;
};

class Basket {
  async getOne(basketId) {
    let basket = await BasketMapping.findByPk(basketId, {
      attributes: ["id"],
      include: [{ model: ProductMapping, attributes: ["id", "name", "image"] }],
    });
    if (!basket) {
      throw new Error("basket не найден в БД");
    }
    //console.log(basket.products);
    return pretty(basket);
  }

  async create(id) {
    const userId = id;
    console.log(userId);
    const basket = await BasketMapping.create({ userId });
    return basket;
  }

  async append(basketId, productId, quantity) {
    let basket = await BasketMapping.findByPk(basketId);
    if (!basket) {
      basket = await BasketMapping.create();
    }
    // проверяем, есть ли уже этот товар в корзине
    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });
    if (basket_product) {
      // есть в корзине
      throw new Error("already in basket");
    } else {
      // нет в корзине
      await BasketProductMapping.create({ basketId, productId });
    }
    // обновим объект корзины, чтобы вернуть свежие данные
    await basket.reload();
    return basket;
  }

  async remove(basketId, productId) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: "products" }],
    });
    if (!basket) {
      basket = await Basket.create();
    }
    // проверяем, есть ли этот товар в корзине
    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });
    if (basket_product) {
      await basket_product.destroy();
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    }
    console.log(basket);
    return basket;
  }

  async clear(basketId) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: "products" }],
    });
    if (basket) {
      await BasketProductMapping.destroy({ where: { basketId } });
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    } else {
      basket = await Basket.create();
    }
    return basket;
  }

  async delete(basketId) {
    const basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: "products" }],
    });
    if (!basket) {
      throw new Error("Корзина не найдена в БД");
    }
    await basket.destroy();
    return basket;
  }
}

export default new Basket();
