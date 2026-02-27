import { prisma } from "../../../lib/prisma";

const addReview = async (
  userId: string,
  eventId: string,
  hostId: string,
  data: { rating: number; comment?: string },
) => {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      userId,
      eventId,
      hostId,
    },
  });
};

const getHostReviews = async (hostId: string) => {
  return prisma.review.findMany({
    where: { hostId },
    include: {
      user: {
        select: { id: true, email: true },
      },
      event: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getHostAverageRating = async (hostId: string) => {
  return prisma.review.aggregate({
    where: { hostId },
    _avg: { rating: true },
    _count: { rating: true },
  });
};

export const ReviewService = {
  addReview,
  getHostReviews,
  getHostAverageRating,
};
