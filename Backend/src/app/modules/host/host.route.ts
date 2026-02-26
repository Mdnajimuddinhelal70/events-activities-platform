import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { hostController } from "./host.controller";

const router = express.Router();

router.post("/create", auth(UserRole.HOST), hostController.createEvent);
router.patch("/:id", auth(UserRole.HOST), hostController.updateEvent);
router.delete("/:id", auth(UserRole.HOST), hostController.deleteEvent);
router.get("/my-events", auth(UserRole.HOST), hostController.getMyEvents);
router.get(
  "/:id/participants",
  auth(UserRole.HOST),
  hostController.getEventParticipants,
);

export default router;
