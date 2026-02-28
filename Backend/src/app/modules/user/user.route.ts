import express from "express";
import { UserRole } from "../../../../generated/prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get("/", userController.getAllFromDB);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.HOST, UserRole.USER),
  userController.getMyProfile,
);

router.post(
  "/create-admin",
  validateRequest(userValidation.createAdmin),
  userController.createAdmin,
);
router.post(
  "/create-user",
  validateRequest(userValidation.createUser),
  userController.registerUser,
);
router.post(
  "/create-host",
  validateRequest(userValidation.createHost),
  userController.createHost,
);

router.patch("/:id/status", userController.changeProfileStatus);
router.patch("/update-my-profile", userController.updateMyProfile);

export const UserRoute = router;
