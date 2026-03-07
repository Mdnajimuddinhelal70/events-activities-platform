import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();
router.get("/", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  AdminController.updateUserStatus,
);

export const AdminRoute = router;
