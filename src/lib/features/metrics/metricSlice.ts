import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface MetricsData {
  //This will tell our system performance metrics
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  pendingAssignments: number;
}
export interface metricState {
  value: MetricsData;
}
const initialState: metricState = {
  value: {
    totalAssigned: 0,
    successRate: 0,
    averageTime: 0,
    pendingAssignments: 0,
  },
};
export const metricSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<MetricsData>) => {
      state.value = action.payload;
    },
  },
});
export const { setMetrics } = metricSlice.actions;
export default metricSlice.reducer;
