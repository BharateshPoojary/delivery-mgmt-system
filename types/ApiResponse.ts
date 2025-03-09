import { AssignmentMetrics } from "../models/Assignment";
import { Order } from "../models/Order";
import { DeliveryPartner } from "../models/Partner";

export interface ApiResponse {
  success: boolean;
  message?: string;
  partner?: Array<DeliveryPartner>;
  orders?: Array<Order>;
  metricsData?: Array<AssignmentMetrics>;
}
