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
              min: DeliveryPartner | null,
              partner //min is the accumulator which is carried forward in each iteration
            ) =>
              !min || partner.currentLoad < min.currentLoad ? partner : min,
            null //initially min will be null new syntax read about this
          ); //reduce will return single object which is having min work load
      if (!getFilteredPartners) {
        //sysytem failed
        // make assignment failed etc
      } else {
        //system passed
        // create order
        let orderNumber = `ORD-${generateOrderNumber()}`;
        // Refer assign route in order
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
