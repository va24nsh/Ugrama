import express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/invoices", authenticate, PaymentController.createInvoice);
router.post("/payments", authenticate, PaymentController.processPayment);
router.get("/invoices", authenticate, PaymentController.getUserInvoices);
router.get(
  "/transactions",
  authenticate,
  PaymentController.getUserTransactions
);
router.post(
  "/razorpay/order",
  authenticate,
  PaymentController.createRazorpayOrder
);
router.post("/razorpay/webhook", PaymentController.processRazorpayWebhook);

export default router;
