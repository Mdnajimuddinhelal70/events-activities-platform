import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/", userController.getAllFromDB);
router.get("/me", userController.getMyProfile);

router.post("/create-admin", userController.createAdmin);
router.post("/create-user", userController.registerUser);
router.post("/create-host", userController.registerHost);

router.patch("/:id/status", userController.changeProfileStatus);
router.patch("/update-my-profile", userController.updateMyProfile);

export const UserRoute = router;
