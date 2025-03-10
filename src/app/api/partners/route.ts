import dbConnection from "../../../../lib/db_connect";
import { PartnerModel } from "../../../../models/Partner";

export async function GET(request: Request) {
  await dbConnection();
  try {
    const getDeliveryPartners = await PartnerModel.find({});
    if (getDeliveryPartners.length > 0) {
      return Response.json(
        {
          success: true,
          partners: getDeliveryPartners,
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "No Partner Found",
        },
        { status: 200 }
      );
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
          message: "Error getting partner",
        },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  const {
    name,
    email,
    phone,
    status,

    areas,
    shift,
  }: {
    name: string;
    email: string;
    phone: string;
    status: "active" | "inactive";

    areas: string[];
    shift: {
      start: string;
      end: string;
    };
  } = await request.json();
  await dbConnection();
  try {
    const addPartner = await new PartnerModel({
      name,
      email,
      phone,
      status,

      areas,
      shift,
    }).save();
    return Response.json(
      {
        success: true,
        partner: addPartner,
        message: "Partner registered successfully",
      },
      { status: 201 }
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
    }
    return Response.json(
      {
        success: false,
        message: "Error adding partner",
      },
      {
        status: 500,
      }
    );
  }
}
