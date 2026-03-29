import axios from "axios";

const PAYCHANGU_BASE_URL = "https://api.paychangu.com";

export interface PaymentCheckoutInput {
  userId?: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentCheckoutResult {
  checkoutUrl: string;
  txRef: string;
  status: "success" | "error";
  message?: string;
}

export class PaymentService {
  private static get secretKey() {
    return process.env.PAYCHANGU_SECRET_KEY || "";
  }

  static async createCheckoutSession(input: PaymentCheckoutInput): Promise<PaymentCheckoutResult> {
    const txRef = `LUNDAI-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (!this.secretKey) {
      console.warn("PAYCHANGU_SECRET_KEY not set – returning mock checkout URL");
      return {
        checkoutUrl: `${process.env.APP_URL || "http://localhost:3000"}/payment/mock?txRef=${txRef}&amount=${input.amount}`,
        txRef,
        status: "success",
        message: "Mock checkout (no API key configured)",
      };
    }

    try {
      const response = await axios.post(
        `${PAYCHANGU_BASE_URL}/payment`,
        {
          amount: input.amount,
          currency: input.currency || "MWK",
          email: input.customerEmail,
          first_name: input.customerName.split(" ")[0],
          last_name: input.customerName.split(" ").slice(1).join(" ") || "N/A",
          callback_url: `${process.env.APP_URL}/api/payments/callback`,
          return_url: input.returnUrl || `${process.env.APP_URL}/payment/success`,
          tx_ref: txRef,
          customization: {
            title: "LUNDAI Housing Deposit",
            description: `Booking deposit for: ${input.propertyTitle}`,
          },
          meta: {
            property_id: input.propertyId,
            user_id: input.userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.status === "success" && data.data?.checkout_url) {
        return {
          checkoutUrl: data.data.checkout_url,
          txRef,
          status: "success",
        };
      }

      throw new Error(data.message || "PayChangu checkout failed");
    } catch (err: any) {
      console.error("Payment checkout error:", err.message);
      return {
        checkoutUrl: "",
        txRef,
        status: "error",
        message: err.message,
      };
    }
  }

  static async verifyPayment(txRef: string) {
    if (!this.secretKey) {
      return { status: "success", amount: 0, currency: "MWK", txRef };
    }

    try {
      const response = await axios.get(`${PAYCHANGU_BASE_URL}/payment/${txRef}`, {
        headers: { Authorization: `Bearer ${this.secretKey}` },
      });
      return response.data.data;
    } catch (err: any) {
      console.error("Payment verification error:", err.message);
      throw err;
    }
  }
}
