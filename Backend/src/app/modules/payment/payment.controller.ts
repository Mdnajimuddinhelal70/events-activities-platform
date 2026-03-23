import { Request, Response } from "express";
import { Stripe } from "stripe";
import { stripe } from "../../../helpers/stripe";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { participantId } = req.body;

  const data = await PaymentService.createPaymentIntent(participantId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment intent created",
    data,
  });
});
const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await PaymentService.handleStripeEvent(event);

  res.json({ received: true });
};

export const PaymentController = {
  createPaymentIntent,
  handleStripeWebhook,
};
