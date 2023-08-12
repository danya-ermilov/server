import { News as NewsMapping } from "./mapping.js";

class News {
  async getOne() {
    const news = await NewsMapping.findOne({
      order: [["id", "DESC"]], // Установка сортировки по убыванию поля 'id'
      limit: 1, // Ограничение результатов одной записью
    });
    if (!news) {
      throw new Error("News не найден в БД");
    }
    return news;
  }

  async create(text) {
    const news = await NewsMapping.create({ text });
    return news;
  }

  async update(id, text) {
    const news = await NewsMapping.findByPk(id);
    if (!news) {
      throw new Error("news не найден в БД");
    }
    await news.update({ text });
    return news;
  }

  async delete(id) {
    const news = await NewsMapping.findByPk(id);
    if (!news) {
      throw new Error("news не найден в БД");
    }
    await news.destroy();
    return news;
  }
}

export default new News();
