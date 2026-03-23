import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../errors/ApiError";
import { eventFilterableFields } from "./event.constants";
import { eventService } from "./evnet.service";

// Get all events with pagination, filtering and sorting
const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, eventFilterableFields);
  const options =
    pick(req.query, ["limit", "page", "sortBy", "sortOrder"]) || {};
  const result = await eventService.getAllEvents(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events fetched successfully",
    data: result,
  });
});

// User can join an event by providing eventId. User must be authenticated to join an event
// const joinEvent = catchAsync(
//   async (req: Request & { user?: any }, res: Response) => {
//     const { eventId } = req.body;
//     const userId = req.user?.id;

//     const result = await eventService.joinEvent(userId, eventId);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Event joined successfully",
//       data: result,
//     });
//   },
// );

const joinEvent = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { eventId } = req.body;
    const userId = req.user?.id;

    const result = await eventService.joinEvent(userId, eventId);

    // 🧠 FREE EVENT
    if (result.type === "FREE") {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Joined successfully (Free Event)",
        data: result.participant,
      });
    }
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Proceed to payment",
      data: {
        participantId: result.participant.id,
      },
    });
  },
);

// User will get all events they have joined, along with event details and host info
const getUserEvents = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
    }

    const result = await eventService.getUserEvents(req.user.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My events fetched successfully",
      data: result,
    });
  },
);

export const eventController = {
  getAllEvents,
  joinEvent,
  getUserEvents,
};
