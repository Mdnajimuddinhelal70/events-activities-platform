import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { fileUploader } from "../../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { hostController } from "./host.controller";
import { EventValidation } from "./host.validation";

const router = express.Router();

router.post(
  "/create-event",
  fileUploader.upload.single("file"),
  auth(UserRole.HOST),
  validateRequest(EventValidation.create),
  hostController.createEvent,
);
router.patch("/:id", auth(UserRole.HOST), hostController.updateEvent);
router.delete("/:id", auth(UserRole.HOST), hostController.deleteEvent);
router.get("/my-events", auth(UserRole.HOST), hostController.getMyEvents);
router.get(
  "/:id/participants",
  auth(UserRole.HOST),
  hostController.getEventParticipants,
);

export default router;
