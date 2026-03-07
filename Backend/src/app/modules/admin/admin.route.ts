import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();
router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
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

router.get("/hosts", auth(UserRole.ADMIN), AdminController.getAllHosts);

router.delete("/events/:id", auth(UserRole.ADMIN), AdminController.deleteEvent);
router.patch(
  "/hosts/:id/status",
  auth(UserRole.ADMIN),
  AdminController.updateHostStatus,
);

export const AdminRoute = router;
