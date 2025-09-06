export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  description?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  invoiceId: string;
  paymentMethod: string;
  paymentDetails: {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_step: string | null;
  error_reason: string | null;
  created_at: number;
  notes?: {
    invoiceId?: string;
    userId?: string;
    description?: string;
  };
}

export interface RazorpayPaymentCapture {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  captured: boolean;
  created_at: number;
}
