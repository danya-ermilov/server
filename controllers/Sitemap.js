import ProductModel from "../models/Product.js";
import UserModel from "../models/User.js";

class Sitemap {
  async get() {
    const options = {
      limit: 1000,
      page: 1,
    };
    const products = await ProductModel.getAll(options);
    const users = await UserModel.getAll();
    const map = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.botoginvest.com:5001/api/</loc>
    </url>
    <url>
        <loc>https://www.botoginvest.com:5001/api/market</loc>
    </url>
    <url>
        <loc>https://www.botoginvest.com:5001/api/news</loc>
    </url>
    
    ${products.rows
      .map((prod) => {
        return `
            <url>
                <loc>${`https://www.botoginvest.com:5001/api/product/${prod.id}`}</loc>
            </url>
        `;
      })
      .join("")}

    ${users
      .map((usr) => {
        return `
            <url>
                <loc>${`https://www.botoginvest.com:5001/api/author/${usr.id}`}</loc>
            </url>
        `;
      })
      .join("")}
    </urlset>
    `;
    return map.trim();
  }
}
//https://www.botoginvest.com:5001/api/
export default new Sitemap();