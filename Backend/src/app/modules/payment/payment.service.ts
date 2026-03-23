// services/payment.service.ts
import Stripe from "stripe";
import { PaymentStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const createPaymentIntent = async (participantId: string) => {
  // participant & event info fetch
  const participant = await prisma.eventParticipant.findUnique({
    where: { id: participantId },
    include: { event: true },
  });

  if (!participant) throw new Error("Participant not found");

  const amount = participant.event.joiningFee * 100;

  // Stripe PaymentIntent create
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: {
      participantId,
    },
  });

  await prisma.payment.create({
    data: {
      userId: participant.userId,
      eventId: participant.eventId,
      participantId,
      amount: participant.event.joiningFee,
      status: PaymentStatus.PENDING,
      transactionId: paymentIntent.id,
    },
  });

  return { clientSecret: paymentIntent.client_secret };
};

const handleStripeEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.payment.update({
        where: { transactionId: paymentIntent.id },
        data: { status: PaymentStatus.SUCCESS },
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.payment.update({
        where: { transactionId: paymentIntent.id },
        data: { status: PaymentStatus.FAILED },
      });
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export const PaymentService = {
  createPaymentIntent,
  handleStripeEvent,
};
