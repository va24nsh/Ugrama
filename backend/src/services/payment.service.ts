import {
  Invoice,
  Transaction,
  PaymentRequest,
  RazorpayPayment,
  RazorpayPaymentCapture,
} from "../types/index";
import { PaymentRepository } from "../repositories/postgres/payment.repository";
import { razorpayInstance } from "../config/razorpay";
import { prisma } from "../config/databases";
import crypto from "crypto";

export class PaymentService {
  static async findInvoiceById(id: string) {
    return PaymentRepository.findInvoiceById(id);
  }

  static async createInvoice(
    userId: string,
    amount: number,
    description?: string
  ) {
    const invoice: Partial<Invoice> = {
      userId,
      amount,
      description,
      status: "pending",
      currency: "INR",
    };

    const createdInvoice = await PaymentRepository.createInvoice(invoice);
    return createdInvoice;
  }

  static async processPayment(paymentRequest: PaymentRequest, user: any) {
    const { invoiceId, paymentMethod, paymentDetails } = paymentRequest;

    const invoice = await PaymentRepository.findInvoiceById(invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (invoice.userId !== user.id) {
      throw new Error("Unauthorized to pay this invoice");
    }

    if (invoice.status !== "PENDING") {
      throw new Error(`Invoice is already ${invoice.status.toLowerCase()}`);
    }

    try {
      const paymentResult = await PaymentService.processWithPaymentGateway(
        invoice,
        paymentMethod,
        paymentDetails
      );

      if (paymentResult.success) {
        const updatedInvoice = await PaymentRepository.updateInvoiceStatus(
          invoiceId,
          "paid",
          new Date()
        );

        const transaction: Partial<Transaction> = {
          invoiceId,
          userId: user.id,
          amount: invoice.amount,
          paymentMethod,
          status: "completed",
          gatewayResponse: paymentResult,
        };

        const createdTransaction = await PaymentRepository.createTransaction(
          transaction
        );

        console.log("Payment successful:", {
          invoiceId: updatedInvoice.id,
          transactionId: createdTransaction.id,
          amount: updatedInvoice.amount,
        });

        return {
          success: true,
          transaction: createdTransaction,
        };
      } else {
        await PaymentRepository.updateInvoiceStatus(invoiceId, "failed");

        const transaction: Partial<Transaction> = {
          invoiceId,
          userId: user.id,
          amount: invoice.amount,
          paymentMethod,
          status: "failed",
          gatewayResponse: paymentResult,
        };

        const createdTransaction = await PaymentRepository.createTransaction(
          transaction
        );

        console.log("Payment failed:", {
          invoiceId,
          error: paymentResult.error,
        });

        return {
          success: false,
          error: paymentResult.error || "Payment failed",
        };
      }
    } catch (error) {
      await PaymentRepository.updateInvoiceStatus(invoiceId, "failed");

      console.error("Payment processing error:", {
        invoiceId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }

  static async getUserInvoices(userId: string) {
    return PaymentRepository.getInvoicesByUserId(userId);
  }

  static async getUserTransactions(userId: string) {
    return PaymentRepository.getTransactionsByUserId(userId);
  }

  static async createRazorpayOrder(invoice: any, user: any) {
    if (!invoice?.amount || invoice.amount <= 0) {
      throw new Error("Invalid invoice amount");
    }
    if (!user?.id) {
      throw new Error("User not found");
    }

    try {
      const options = {
        amount: Math.round(invoice.amount * 100), // Convert to paise
        currency: invoice.currency || "INR",
        receipt: `receipt_${invoice.id}`,
        payment_capture: 1,
        notes: {
          invoiceId: String(invoice.id),
          userId: String(user.id),
          description: invoice.description || "",
        },
      };

      const order = await razorpayInstance.orders.create(options);
      return order;
    } catch (error: any) {
      console.error("Error creating Razorpay order:", error?.message || error);
      throw new Error(error?.description || "Failed to create payment order");
    }
  }

  static async verifyRazorpayPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ) {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay key secret not configured");
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");
    return generatedSignature === signature;
  }

  private static async processWithPaymentGateway(
    invoice: any,
    paymentMethod: string,
    paymentDetails: any
  ): Promise<any> {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        paymentDetails;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return {
          success: false,
          error: "Missing payment details",
          reason: "Invalid payment data",
        };
      }

      // Verify payment signature
      const isValidSignature =
        await PaymentService.verifyRazorpayPaymentSignature(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        );

      if (!isValidSignature) {
        return {
          success: false,
          error: "Invalid payment signature",
          reason: "Payment verification failed",
        };
      }

      // Fetch payment details from Razorpay
      const payment = (await razorpayInstance.payments.fetch(
        razorpay_payment_id
      )) as RazorpayPayment;

      if (payment.status === "captured") {
        return {
          success: true,
          transactionId: payment.id,
          orderId: payment.order_id,
          method: payment.method,
          bank: payment.bank,
          wallet: payment.wallet,
          vpa: payment.vpa,
          processedAt: new Date(payment.created_at * 1000).toISOString(),
          razorpayResponse: payment,
        };
      } else if (payment.status === "authorized") {
        // Capture authorized payment
        const captureAmount = Math.round(invoice.amount * 100); // Convert to paise
        const captureResponse = (await razorpayInstance.payments.capture(
          razorpay_payment_id,
          captureAmount,
          invoice.currency || "INR"
        )) as RazorpayPaymentCapture;

        return {
          success: true,
          transactionId: payment.id,
          orderId: payment.order_id,
          method: payment.method,
          processedAt: new Date().toISOString(),
          razorpayResponse: captureResponse,
        };
      } else {
        return {
          success: false,
          error: `Payment ${payment.status}`,
          reason: payment.error_description || "Payment not completed",
          razorpayResponse: payment,
        };
      }
    } catch (error: any) {
      console.error("Razorpay payment processing error:", error);

      if (error.error) {
        // Razorpay API error
        return {
          success: false,
          error: error.error.description || "Payment processing failed",
          reason: error.error.code || "unknown_error",
          razorpayError: error.error,
        };
      }

      return {
        success: false,
        error: error.message || "Payment processing failed",
        reason: "unknown_error",
      };
    }
  }

  static async getPaymentStatus(paymentId: string) {
    try {
      const payment = await razorpayInstance.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw new Error("Failed to fetch payment status");
    }
  }

  static verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
        console.error("Razorpay webhook secret not configured");
        return false;
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(payload)
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(signature, "hex")
      );
    } catch (error) {
      console.error("Error verifying webhook signature:", error);
      return false;
    }
  }

  static async handleRazorpayWebhook(event: any) {
    try {
      // Verify webhook signature
      const webhookSignature = event.headers["x-razorpay-signature"];
      const payloadString =
        typeof event.body === "string"
          ? event.body
          : JSON.stringify(event.body);

      const isValidWebhook = PaymentService.verifyWebhookSignature(
        payloadString,
        webhookSignature
      );

      if (!isValidWebhook) {
        throw new Error("Invalid webhook signature");
      }

      const eventData =
        typeof event.body === "string" ? JSON.parse(event.body) : event.body;

      const eventType = eventData.event;

      switch (eventType) {
        case "payment.captured":
          await PaymentService.handlePaymentCaptured(
            eventData.payload.payment.entity
          );
          break;

        case "payment.failed":
          await PaymentService.handlePaymentFailed(
            eventData.payload.payment.entity
          );
          break;

        case "payment.authorized":
          await PaymentService.handlePaymentAuthorized(
            eventData.payload.payment.entity
          );
          break;

        default:
          console.log(`Unhandled webhook event: ${eventType}`);
      }

      return {
        success: true,
        message: `Processed ${eventType} event`,
      };
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw new Error(
        `Failed to process webhook: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async handlePaymentCaptured(payment: RazorpayPayment) {
    try {
      const { notes } = payment;
      const invoiceId = notes?.invoiceId;

      if (!invoiceId) {
        console.error("Invoice ID not found in payment metadata");
        return;
      }

      const invoice = await PaymentRepository.findInvoiceById(invoiceId);

      if (!invoice) {
        console.error(
          `Invoice ${invoiceId} not found for payment ${payment.id}`
        );
        return;
      }

      if (invoice.status !== "PAID") {
        const updatedInvoice = await PaymentRepository.updateInvoiceStatus(
          invoiceId,
          "paid",
          new Date()
        );

        const transaction: Partial<Transaction> = {
          invoiceId,
          userId: invoice.userId,
          amount: invoice.amount,
          paymentMethod: payment.method,
          status: "completed",
          gatewayResponse: {
            success: true,
            transactionId: payment.id,
            orderId: payment.order_id,
            method: payment.method,
            processedAt: new Date(payment.created_at * 1000).toISOString(),
            razorpayResponse: payment,
          },
        };

        const createdTransaction = await PaymentRepository.createTransaction(
          transaction
        );

        console.log("Payment captured via webhook:", {
          invoiceId: updatedInvoice.id,
          transactionId: createdTransaction.id,
          paymentId: payment.id,
        });

        // Get user email for notification
        const user = await prisma.user.findUnique({
          where: { id: invoice.userId },
        });

        if (user) {
          console.log(`Payment confirmation for user: ${user.email}`);
        }
      }
    } catch (error) {
      console.error("Error handling payment captured webhook:", error);
      throw error;
    }
  }

  static async handlePaymentFailed(payment: RazorpayPayment) {
    try {
      const { notes } = payment;
      const invoiceId = notes?.invoiceId;

      if (!invoiceId) {
        console.error("Invoice ID not found in payment metadata");
        return;
      }

      const invoice = await PaymentRepository.findInvoiceById(invoiceId);

      if (!invoice) {
        console.error(
          `Invoice ${invoiceId} not found for failed payment ${payment.id}`
        );
        return;
      }

      await PaymentRepository.updateInvoiceStatus(invoiceId, "failed");

      const transaction: Partial<Transaction> = {
        invoiceId,
        userId: invoice.userId,
        amount: invoice.amount,
        paymentMethod: payment.method || "unknown",
        status: "failed",
        gatewayResponse: {
          success: false,
          error: payment.error_description || "Payment failed",
          reason: payment.error_code || "payment_failed",
          razorpayResponse: payment,
        },
      };

      const createdTransaction = await PaymentRepository.createTransaction(
        transaction
      );

      console.log("Payment failed via webhook:", {
        invoiceId,
        transactionId: createdTransaction.id,
        paymentId: payment.id,
        error: payment.error_description,
      });
    } catch (error) {
      console.error("Error handling payment failed webhook:", error);
      throw error;
    }
  }

  static async handlePaymentAuthorized(payment: RazorpayPayment) {
    try {
      const { notes } = payment;
      const invoiceId = notes?.invoiceId;

      if (!invoiceId) {
        console.error("Invoice ID not found in payment metadata");
        return;
      }

      const invoice = await PaymentRepository.findInvoiceById(invoiceId);

      if (!invoice) {
        console.error(
          `Invoice ${invoiceId} not found for authorized payment ${payment.id}`
        );
        return;
      }

      const captureAmount = Math.round(invoice.amount * 100); // Convert to paise
      try {
        await razorpayInstance.payments.capture(
          payment.id,
          captureAmount,
          invoice.currency || "INR"
        );

        console.log(
          `Captured payment ${payment.id} from authorization webhook`
        );
      } catch (captureError) {
        console.error(
          `Failed to capture authorized payment ${payment.id}:`,
          captureError
        );
        await PaymentRepository.updateInvoiceStatus(invoiceId, "failed");

        console.log("Payment authorization capture failed:", {
          invoiceId,
          paymentId: payment.id,
          error:
            captureError instanceof Error
              ? captureError.message
              : "Failed to capture payment",
        });
      }
    } catch (error) {
      console.error("Error handling payment authorized webhook:", error);
      throw error;
    }
  }
}
