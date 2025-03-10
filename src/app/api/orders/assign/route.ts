import { generateOrderNumber } from "../../../../../utils/generateordernumber";
import { Order, OrderModel } from "../../../../../models/Order";
import { PartnerModel } from "../../../../../models/Partner";
import {
  Assignment,
  AssignmentMetricsModel,
  AssignmentModel,
} from "../../../../../models/Assignment";
export async function POST(request: Request) {
  const {
    partnerId, //When the user select the partner using partner name consider its associated partnerId and send it as request
    customerName,
    customerPhone,
    customerAddress,
    area,
    items,
    scheduledFor,
    assignedTo,
    totalAmount,
  }: {
    partnerId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    area: string;
    items: { name: string; quantity: number; price: number }[];
    scheduledFor: string;
    assignedTo: string;
    totalAmount: string;
  } = await request.json();
  let orderNumber = `ORD-${generateOrderNumber()}`;
  try {
    //create new Order
    const createOrder: Order = await new OrderModel({
      orderNumber,
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
      },
      area,
      items,
      status: "pending",
      scheduledFor,
      assignedTo,
      totalAmount,
      createdAt: new Date(), //store the date as date object and when needed make it to HH:MM format
      updatedAt: new Date(),
    }).save();
    const getPartner = await PartnerModel.findByIdAndUpdate(
      { _id: partnerId },
      { $inc: { currentLoad: 1 } },
      { $new: true }
    );
    if (getPartner) {
      //load incremented
      const performingAssignment: Assignment = await new AssignmentModel({
        orderId: createOrder._id,
        partnerId,
        timestamp: new Date(),
        status: "success", // It will be based on partner if he cancels  then one more field will be added i.e reason which will contain the reason for cancellation
      }).save();

      // make the order status to assigned
      const updateOrderStatus = await OrderModel.findByIdAndUpdate(
        //If the partner agrees to deliver  then pnly
        { _id: createOrder._id },
        { $set: { status: "assigned" } },
        { $new: true }
      );
      const updateAssignmentMetrics =
        await AssignmentMetricsModel.findOneAndUpdate(
          {}, //This will include filtering field using which the collection will be sorted if no filtering  criteria present then it will consider any document which is first doc in this case as this collection will have single doc which will be updated each time
          { $inc: { totalAssigned: 1 } },
          { new: true, upsert: true } //upsert:true will create the document if no doc present in collection
          //YOU HAVE TO CALCULATE successRate ,averageTime, and also need to determine failureReasons when partner cancels to deliver that order
        );
      if (
        performingAssignment &&
        updateOrderStatus &&
        updateAssignmentMetrics
      ) {
        return Response.json(
          {
            status: true,
            message: "Order Assigned successfully",
          },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Error assigning order",
        },
        { status: 500 }
      );
    }
  }
}
