import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { eventService } from "./evnet.service";

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getAllEvents();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events fetched successfully",
    data: result,
  });
});

const joinEvent = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { eventId } = req.body;
    const userId = req.user?.id;

    const result = await eventService.joinEvent(userId, eventId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event joined successfully",
      data: result,
    });
  },
);

export const eventController = {
  getAllEvents,
  joinEvent,
};
