import { supportsMethod, type PaymentConfig, type PaymentMethod } from "../../api/paystack-api";

/** The method to start on: Paystack when offered (it reconciles itself), else transfer. */
export const defaultMethod = (config?: PaymentConfig | null): PaymentMethod => (supportsMethod(config, "paystack") ? "paystack" : "bank_transfer");
