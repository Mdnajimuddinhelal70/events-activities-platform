import express from "express";
import { UserRole } from "../../../../generated/prisma/client";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/", userController.getAllFromDB);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.HOST, UserRole.USER),
  userController.getMyProfile,
);

router.post("/create-admin", userController.createAdmin);
router.post("/create-user", userController.registerUser);
router.post("/create-host", userController.createHost);

router.patch("/:id/status", userController.changeProfileStatus);
router.patch("/update-my-profile", userController.updateMyProfile);

export const UserRoute = router;
