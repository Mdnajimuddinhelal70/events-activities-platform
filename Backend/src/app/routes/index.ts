import express from "express";
import { apiLimiter } from "../middlewares/rateLimiter";
import { AuthRoutes } from "../modules/auth/auth.route";
import { eventRoute } from "../modules/event/event.route";
import hostRoute from "../modules/host/host.route";
import { ReviewRoute } from "../modules/review/review.route";
import { UserRoute } from "../modules/user/user.route";

const router = express.Router();

router.use(apiLimiter);

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/events",
    route: eventRoute,
  },
  {
    path: "/events",
    route: hostRoute,
  },
  {
    path: "/reviews",
    route: ReviewRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
