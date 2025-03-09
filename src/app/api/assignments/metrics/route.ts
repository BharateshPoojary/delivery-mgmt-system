import { AssignmentMetricsModel } from "../../../../../models/Assignment";

export async function GET() {
  const getAssignmentMetrics = await AssignmentMetricsModel.find({});
  if (getAssignmentMetrics) {
    return Response.json(
      {
        success: true,
        metricsData: getAssignmentMetrics,
      },
      {
        status: 200,
      }
    );
  }
}
