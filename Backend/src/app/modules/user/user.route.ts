import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/create-admin", userController.createAdmin);
router.post("/create-user", userController.registerUser);
router.post("/create-host", userController.registerHost);

export const UserRoute = router;
