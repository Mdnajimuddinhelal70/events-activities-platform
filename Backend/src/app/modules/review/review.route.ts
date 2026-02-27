import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/:eventId/:hostId",
  auth(UserRole.USER),
  ReviewController.addReview,
);

router.get("/:hostId", ReviewController.getHostReviews);

router.get("/:hostId/average", ReviewController.getHostAverageRating);

export const ReviewRoute = router;
