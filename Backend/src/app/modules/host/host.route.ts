import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { fileUploader } from "../../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { hostController } from "./host.controller";
import { EventValidation } from "./host.validation";

const router = express.Router();

router.post(
  "/create-event",
  fileUploader.upload.single("file"),
  auth(UserRole.HOST),
  (req: Request, res: Response, next: NextFunction) => {
    const parsedData = JSON.parse(req.body.data);

    req.body = EventValidation.create.parse({
      body: parsedData,
    }).body;

    next();
  },
  hostController.createEvent,
);
router.patch(
  "/:id",
  auth(UserRole.HOST),
  fileUploader.upload.single("file"),
  hostController.updateEvent,
);
router.delete("/:id", auth(UserRole.HOST), hostController.deleteEvent);
router.get("/my-events", auth(UserRole.HOST), hostController.getMyEvents);
router.get(
  "/:id/participants",
  auth(UserRole.HOST),
  hostController.getEventParticipants,
);

export default router;
