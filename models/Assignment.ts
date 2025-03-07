import mongoose, { Schema, Document } from "mongoose";

export interface Assignment extends Document {
  orderId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  timestamp: Date;
  status: "success" | "failed";
  reason?: string;
}
type AssignmentMetrics = {
  //This will tell our system performance metrics
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: { reason: string; count: number }[];
};

const AssignmentSchema = new Schema<Assignment>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true }, // Reference to Order
  partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true }, // Reference to DeliveryPartner
  timestamp: { type: Date, default: Date.now }, // Automatically set timestamp
  status: {
    type: String,
    enum: ["success", "failed"],
    required: true,
  },
  reason: { type: String, default: null }, // Reason for failure (optional)
});
