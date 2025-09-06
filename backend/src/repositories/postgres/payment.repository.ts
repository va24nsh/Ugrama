import { Invoice, Transaction } from "../../types/index";
import { prisma } from "../../config/databases";

export class PaymentRepository {
  private prisma = prisma;

  static async createInvoice(invoice: Partial<Invoice>) {
    return await prisma.invoice.create({
      data: {
        userId: invoice.userId!,
        amount: invoice.amount!,
        currency: invoice.currency || "USD",
        description: invoice.description,
      },
    });
  }

  static async findInvoiceById(id: string) {
    return await prisma.invoice.findUnique({
      where: { id },
    });
  }

  static async updateInvoiceStatus(id: string, status: string, paidAt?: Date) {
    const prismaStatus = status.toUpperCase() as any;
    return await prisma.invoice.update({
      where: { id },
      data: {
        status: prismaStatus,
        paidAt: paidAt || undefined,
      },
    });
  }

  static async createTransaction(transaction: Partial<Transaction>) {
    const prismaStatus = transaction.status?.toUpperCase() as any;
    return await prisma.transaction.create({
      data: {
        invoiceId: transaction.invoiceId!,
        userId: transaction.userId!,
        amount: transaction.amount!,
        paymentMethod: transaction.paymentMethod!,
        status: prismaStatus || "PENDING",
        gatewayResponse: transaction.gatewayResponse,
      },
    });
  }

  static async getTransactionsByUserId(userId: string) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        invoice: true,
      },
    });
  }

  static async getInvoicesByUserId(userId: string) {
    return await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        transactions: true,
      },
    });
  }

  static async findTransactionById(id: string) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });
  }

  static async findTransactionByGatewayId(gatewayId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        gatewayResponse: {
          path: ["transactionId"],
          equals: gatewayId,
        },
      },
      include: {
        invoice: true,
      },
    });

    return transactions[0];
  }

  static async updateTransactionStatus(
    id: string,
    status: string,
    additionalData?: any
  ) {
    const prismaStatus = status.toUpperCase() as any;
    const updateData: any = { status: prismaStatus };

    if (additionalData) {
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      updateData.gatewayResponse = {
        ...((existingTransaction?.gatewayResponse as any) || {}),
        ...additionalData,
      };
    }

    return await prisma.transaction.update({
      where: { id },
      data: updateData,
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
