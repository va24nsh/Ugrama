import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { PaymentRequest } from "../types/index";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

export class PaymentController {
  static async createInvoice(req: Request, res: Response) {
    try {
      const { amount, description } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      if (!user.id) {
        return res.status(400).json({
          success: false,
          error: "User ID is missing",
        });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: "Valid amount is required",
        });
      }

      const invoice = await PaymentService.createInvoice(
        user.id,
        amount,
        description
      );

      res.status(201).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      console.error("Create invoice error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server error at payment service",
      });
    }
  }

  static async processPayment(req: Request, res: Response) {
    try {
      const paymentRequest: PaymentRequest = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      if (!paymentRequest.invoiceId || !paymentRequest.paymentMethod) {
        return res.status(400).json({
          success: false,
          error: "Invoice ID and payment method are required",
        });
      }

      if (!paymentRequest.paymentDetails) {
        return res.status(400).json({
          success: false,
          error: "Payment details are required",
        });
      }

      const result = await PaymentService.processPayment(paymentRequest, user);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.transaction,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Process payment error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server error at payment service",
      });
    }
  }

  static async getUserInvoices(req: Request, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      if (!user.id) {
        return res.status(400).json({
          success: false,
          error: "User ID is missing",
        });
      }

      const invoices = await PaymentService.getUserInvoices(user.id);

      res.status(200).json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      console.error("Get user invoices error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server error at payment service",
      });
    }
  }

  static async getUserTransactions(req: Request, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      if (!user.id) {
        return res.status(400).json({
          success: false,
          error: "User ID is missing",
        });
      }

      const transactions = await PaymentService.getUserTransactions(user.id);

      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      console.error("Get user transactions error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server error at payment service",
      });
    }
  }

  static async createRazorpayOrder(req: Request, res: Response) {
    try {
      const { invoiceId } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      if (!invoiceId) {
        return res.status(400).json({
          success: false,
          error: "Invoice ID is required",
        });
      }

      const invoice = await PaymentService.findInvoiceById(invoiceId);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: "Invoice not found",
        });
      }

      if (invoice.userId !== user.id) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized to access this invoice",
        });
      }

      if (invoice.status !== "PENDING") {
        return res.status(400).json({
          success: false,
          error: `Invoice is already ${invoice.status.toLowerCase()}`,
        });
      }

      const order = await PaymentService.createRazorpayOrder(invoice, user);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Create Razorpay order error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server error at payment service",
      });
    }
  }

  static async processRazorpayWebhook(req: Request, res: Response) {
    try {
      const event = {
        headers: req.headers,
        body: req.body,
      };

      const result = await PaymentService.handleRazorpayWebhook(event);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Webhook processing error",
      });
    }
  }
}
