import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { HostService } from "./host.service";

const createEvent = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id; // JWT থেকে আসা User এর id
    const result = await HostService.createEvent(userId, req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Event created successfully",
      data: result,
    });
  },
);

const updateEvent = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await HostService.updateEvent(
      id as string,
      userId,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event updated successfully",
      data: result,
    });
  },
);

const deleteEvent = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await HostService.deleteEvent(id as string, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event deleted successfully",
      data: result,
    });
  },
);

const getMyEvents = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id;
    const result = await HostService.getMyEvents(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My events retrieved successfully",
      data: result,
    });
  },
);

const getEventParticipants = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await HostService.getEventParticipants(id as string, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event participants retrieved successfully",
      data: result,
    });
  },
);

export const hostController = {
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventParticipants,
};
