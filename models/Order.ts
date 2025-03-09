import mongoose, { Schema, Document } from "mongoose";

export interface Order extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: { name: string; quantity: number; price: number }[];
  status: "pending" | "assigned" | "picked" | "delivered";
  scheduledFor: string; // HH:mm
  assignedTo?: mongoose.Types.ObjectId;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
const orderSchema = new Schema<Order>({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  area: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "assigned", "picked", "delivered"],
    default: "pending",
  },
  scheduledFor: { type: String, required: true }, // Format: HH:mm
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "Partner",
    default: null,
  },
  totalAmount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model("Order", orderSchema);
