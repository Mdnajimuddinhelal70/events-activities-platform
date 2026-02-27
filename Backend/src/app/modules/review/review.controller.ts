import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";

const addReview = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id;
    const eventId = req.params.eventId as string;
    const hostId = req.params.hostId as string;
    const result = await ReviewService.addReview(
      userId,
      eventId,
      hostId,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review added successfully",
      data: result,
    });
  },
);

const getHostReviews = catchAsync(async (req: Request, res: Response) => {
  const { hostId } = req.params;
  const result = await ReviewService.getHostReviews(hostId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Host reviews retrieved successfully",
    data: result,
  });
});

const getHostAverageRating = catchAsync(async (req: Request, res: Response) => {
  const { hostId } = req.params;
  const result = await ReviewService.getHostAverageRating(hostId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Host average rating retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  addReview,
  getHostReviews,
  getHostAverageRating,
};
