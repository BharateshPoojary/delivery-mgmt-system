import { OrderModel } from "../../../../models/Order";

export async function GET() {
  try {
    const OrdersAvailable = await OrderModel.find({});
    if (OrdersAvailable.length > 0) {
      return Response.json(
        {
          status: true,
          message: "No Orders Available",
        },
        {
          status: 200,
        }
      );
    }
    return Response.json(
      {
        success: true,
        orders: OrdersAvailable,
        message: "Orders fetched successfully",
      },
      {
        status: 200,
      }
    );
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
          message: "Error getting partner",
        },
        { status: 500 }
      );
    }
  }
}
