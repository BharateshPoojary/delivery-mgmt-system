import mongoose, { Schema, Document } from "mongoose";
export interface DeliveryPartner extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  currentLoad: number; // max: 3
  areas: string[];
  shift: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
}

const PartnerSchema: Schema<DeliveryPartner> = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"], //regex pattern for email validation
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
  },
  currentLoad: {
    type: Number,
    required: true,
  },
  areas: { type: [String], required: true },
  shift: {
    start: { type: String, required: true }, // Format: HH:mm
    end: { type: String, required: true }, // Format: HH:mm
  },
  metrics: {
    rating: { type: Number, required: true, min: 0, max: 5 }, // Rating out of 5
    completedOrders: { type: Number, required: true, default: 0 },
    cancelledOrders: { type: Number, required: true, default: 0 },
  },
});

export const PartnerModel =
  (mongoose.models.Partner as mongoose.Model<DeliveryPartner>) ||
  mongoose.model("Partner", PartnerSchema);
