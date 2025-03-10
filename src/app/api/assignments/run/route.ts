import {
  Assignment,
  AssignmentMetricsModel,
  AssignmentModel,
} from "../../../../../models/Assignment";
import { Order, OrderModel } from "../../../../../models/Order";
import { DeliveryPartner, PartnerModel } from "../../../../../models/Partner";
import { generateOrderNumber } from "../../../../../utils/generateordernumber";

export async function POST(request: Request) {
  const {
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
  //First I will whether partner is available or not then I will create order

  try {
    const getFilteredPartnersWithHighestRating = await PartnerModel.find({
      status: "active",
      currentLoad: { $lt: 3 },
      areas: { $in: area },
      shift: { end: { $gt: scheduledFor } },
    }).sort({ "metrics.rating": -1 });
    if (getFilteredPartnersWithHighestRating.length > 0) {
      const highestRating =
        getFilteredPartnersWithHighestRating[0].metrics.rating;
      const getFilteredPartners: DeliveryPartner | null =
        getFilteredPartnersWithHighestRating
          .filter(
            (eachfilteredpartner) =>
              eachfilteredpartner.metrics.rating === highestRating &&
              eachfilteredpartner.metrics.completedOrders >
                eachfilteredpartner.metrics.cancelledOrders
          )
          .reduce(
            (
              min: DeliveryPartner | null, //min is the accumulator which is carried forward in each iteration
              partner //This will include new partner object in each iteration
            ) =>
              !min || partner.currentLoad < min.currentLoad ? partner : min,
            null //initially min will be null new syntax read about this
          ); //reduce will return single object which is having min work load
      if (!getFilteredPartners) {
        //sysytem failed
        // make assignment failed etc
        return Response.json(
          {
            success: true,
            message: "No partner present for assignment",
          },
          {
            status: 200,
          }
        );
      } else {
        //system passed
        // create order
        let orderNumber = `ORD-${generateOrderNumber()}`;
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
        // Refer assign route in order
        const getPartner = await PartnerModel.findByIdAndUpdate(
          { _id: getFilteredPartners._id },
          { $inc: { currentLoad: 1 } },
          { $new: true }
        );
        if (getPartner) {
          //load incremented
          const performingAssignment: Assignment = await new AssignmentModel({
            orderId: createOrder._id,
            partnerId: getFilteredPartners._id,
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
                message: "Order Assigned successfully by our system",
              },
              { status: 200 }
            );
          }
        }
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
          message: "Error assigning partner",
        },
        { status: 500 }
      );
    }
  }
}
