import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { eventController } from "./event.controller";
import { EventValidation } from "./event.validation";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.USER, UserRole.HOST, UserRole.ADMIN),
  validateRequest(EventValidation.eventQuery),
  eventController.getAllEvents,
);

router.post(
  "/join",
  auth(UserRole.USER, UserRole.HOST, UserRole.ADMIN),
  eventController.joinEvent,
);

export const eventRoute = router;
