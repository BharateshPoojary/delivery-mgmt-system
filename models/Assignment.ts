import mongoose, { Schema, Document } from "mongoose";

export interface Assignment extends Document {
  orderId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  timestamp: Date;
  status: "success" | "failed";
  reason?: string;
}
export interface AssignmentMetrics extends Document {
  //This will tell our system performance metrics
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: { reason: string; count: number }[];
}

const AssignmentMetricsSchema = new Schema<AssignmentMetrics>({
  totalAssigned: {
    type: Number,
    required: true,
  },
  successRate: {
    type: Number,
    required: true,
  },
  averageTime: {
    type: Number,
    required: true,
  },
  failureReasons: [
    {
      reason: { type: String },
      count: {
        type: Number,
      },
    },
  ],
});

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
export const AssignmentModel =
  (mongoose.models.Assignment as mongoose.Model<Assignment>) ||
  mongoose.model("Assignment", AssignmentSchema);

export const AssignmentMetricsModel =
  (mongoose.models.AssignmentMetrics as mongoose.Model<AssignmentMetrics>) ||
  mongoose.model("AssignmentMetrics", AssignmentMetricsSchema);
