import { PartnerModel } from "../../../../../models/Partner";

export async function PUT(request: Request, params: { id: string }) {
  const id = params.id;
  const getUpdateField = await request.json();
  try {
    const updatePartner = await PartnerModel.findByIdAndUpdate(
      id,
      getUpdateField,
      {
        $new: true,
      }
    );
    if (!updatePartner) {
      return Response.json(
        {
          success: false,
          message: "Partner Not Found To Update",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        partner: updatePartner,
        message: "Profile updated successfully",
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
          message: "Error updating profile",
        },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(request: Request, params: { id: string }) {
  const id = params.id;

  try {
    const deletePartner = await PartnerModel.findByIdAndDelete({
      id,
    });
    if (!deletePartner) {
      return Response.json(
        {
          success: false,
          message: "Partner Not Found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Partner Deleted successfully",
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
          message: "Error updating profile",
        },
        { status: 500 }
      );
    }
  }
}
