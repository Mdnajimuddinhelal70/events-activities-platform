import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { eventController } from "./event.controller";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.USER, UserRole.HOST, UserRole.ADMIN),
  eventController.getAllEvents,
);

router.post(
  "/join",
  auth(UserRole.USER, UserRole.HOST, UserRole.ADMIN),
  eventController.joinEvent,
);

export const eventRoute = router;
