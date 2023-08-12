import express from "express";
import UserController from "../controllers/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import userMiddleware from "../middleware/userMiddleware.js";

const router = new express.Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/check", authMiddleware, UserController.check);

router.get("/getall", authMiddleware, UserController.getAll);
router.get(
  "/getone/:id([0-9]+)",
  //authMiddleware,
  //userMiddleware,
  UserController.getOne
);
router.post("/create", authMiddleware, userMiddleware, UserController.create);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  userMiddleware,
  UserController.update
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  userMiddleware,
  UserController.delete
);

export default router;
