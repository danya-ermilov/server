import { Product as ProductMapping } from "./mapping.js";
import { Brand as BrandMapping } from "./mapping.js";
import { Category as CategoryMapping } from "./mapping.js";
import AppError from "../errors/AppError.js";
import FileService from "../services/File.js";
import { Op } from "sequelize";

class Product {
  async getAll(options) {
    let old = "DESC";
    let {
      categoryId,
      brandId,
      userId,
      limit,
      page,
      name,
      sort = "rating",
    } = options;
    if (sort === "updatedAt") {
      sort = "createdAt";
      old = "ASC";
    } else {
      old = "DESC";
    }
    console.log(old, sort);
    const offset = (page - 1) * limit;
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (userId) where.userId = userId;
    if (name)
      where.name = {
        [Op.like]: `%${name}%`,
      };
    const products = await ProductMapping.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: BrandMapping, as: "brand" },
        { model: CategoryMapping, as: "category" },
      ],
      order: [[sort, old]],
    });
    return products;
  }

  async getOne(id) {
    const product = await ProductMapping.findByPk(id);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    return product;
  }

  async create(data, img, pdf, zip, id) {
    // поскольку image не допускает null, задаем пустую строку
    const image = FileService.save(img) ?? "";
    const pdf_file = FileService.save(pdf) ?? "";
    const zip_file = FileService.save(zip) ?? "";
    const {
      name,
      link = null,
      userId = id,
      categoryId = null,
      brandId = null,
    } = data;
    const product = await ProductMapping.create({
      name,
      link,
      pdf_file,
      userId,
      image,
      categoryId,
      brandId,
      zip_file,
    });
    return product;
  }

  async update(id, data, img, pdf, zip) {
    const product = await ProductMapping.findByPk(id);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    // пробуем сохранить изображение, если оно было загружено
    const file = FileService.save(img);
    const file1 = FileService.save(pdf);
    const file2 = FileService.save(zip);
    // если загружено новое изображение — надо удалить старое
    if (file && product.image) {
      FileService.delete(product.image);
    }
    if (file1 && product.pdf_file) {
      FileService.delete(product.pdf_file);
    }
    if (file2 && product.zip_file) {
      FileService.delete(product.zip_file);
    }
    console.log("ok");

    // подготавливаем данные, которые надо обновить в базе данных
    const {
      name = product.name,
      link = product.link,
      categoryId = product.categoryId,
      userId = product.userId,
      brandId = product.brandId,
      image = file ? file : product.image,
      pdf_file = file1 ? file1 : product.pdf_file,
      zip_file = file2 ? file2 : product.zip_file,
    } = data;
    await product.update({
      name,
      link,
      pdf_file,
      image,
      categoryId,
      userId,
      brandId,
      zip_file,
    });
    return product;
  }

  async delete(id) {
    const product = await ProductMapping.findByPk(id);
    if (!product) {
      throw new Error("Товар не найден в БД");
    }
    await product.destroy();
    return product;
  }
}

export default new Product();
