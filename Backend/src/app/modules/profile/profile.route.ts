import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { ProfileController } from "./profile.controller";

const router = express.Router();
router.get("/profile", auth(UserRole.USER), ProfileController.getProfile);
router.get("/profiles/:id", ProfileController.getPublicProfile);
router.post("/profile", auth(UserRole.USER), ProfileController.createProfile);
router.patch("/profile", auth(UserRole.USER), ProfileController.updateProfile);

export const ProfileRoute = router;
