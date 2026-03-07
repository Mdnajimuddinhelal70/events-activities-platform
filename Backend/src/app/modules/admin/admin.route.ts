import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();
router.get("/", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.get("/events", auth(UserRole.ADMIN), AdminController.getAllEvents);
router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  AdminController.updateUserStatus,
);

router.patch(
  "/events/:id/status",
  auth(UserRole.ADMIN),
  AdminController.updateEventStatus,
);

router.delete("/events/:id", auth(UserRole.ADMIN), AdminController.deleteEvent);

export const AdminRoute = router;
