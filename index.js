/*
import config from "dotenv/config";
import express from "express";
import sequelize from "./sequelize.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import router from "./routes/index.js";
import ErrorHandler from "./middleware/ErrorHandler.js";

const PORT = process.env.PORT || 5001;

const app = express();
// Cross-Origin Resource Sharing
app.use(cors());
// middleware для работы с json
app.use(express.json());
// middleware для статики (img, css)n
app.use(express.static("static"));
// middleware для загрузки файлов
app.use(fileUpload());
// все маршруты приложения
app.use("/api", router);

// обработка ошибок
app.use(ErrorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("Сервер запущен на порту", PORT));
  } catch (e) {
    console.log(e);
  }
};

start();
*/

import fs from "fs";
import https from "https"; // Импорт модуля https

import config from "dotenv/config";
import express from "express";
import sequelize from "./sequelize.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import router from "./routes/index.js";
import ErrorHandler from "./middleware/ErrorHandler.js";
import Sitemap from "../server/controllers/Sitemap.js";
import cron from "node-cron";

const PORT = process.env.PORT || 5001;

// Загрузка SSL-сертификата и приватного ключа
const privateKey = fs.readFileSync("/etc/letsencrypt/live/botoginvest.com/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/botoginvest.com/cert.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload());
app.use("/api", router);
app.use(ErrorHandler);

// Создание HTTPS-сервера с использованием сертификата и ключа
const httpsServer = https.createServer(credentials, app);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    cron.schedule(
      "0 6 * * *", // Расписание (раз в день в 6 утра)
      () => {
        Sitemap.get(); // Вызываем функцию генерации sitemap
      },
      {
        scheduled: true,
        timezone: "America/New_York",
      }
    );

    app.get("/sitemap.xml", async (req, res) => {
      try {
        const sitemap = await Sitemap.get();
        res.header("Content-Type", "application/xml");
        res.send(sitemap);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    
    // Запуск HTTPS-сервера
    httpsServer.listen(PORT, () => console.log("Сервер запущен на порту", PORT));
  } catch (e) {
    console.log(e);
  }
};

start();

