"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse } from "../../types/ApiResponse";
import { setMetrics } from "@/lib/features/metrics/metricSlice";
const HomePage = () => {
  type MetricsType = {
    title: string;
    value: string;
  };
  const [metricsDataState, setMetricsDataState] = useState<MetricsType[]>([
    {
      title: "",
      value: "",
    },
  ]);
  const metricsData: MetricsType[] = [
    {
      title: "TotalAssigned",
      value: "10", // create a global state here which will change as per the scenario
    },
    {
      title: "Success Rate",
      value: "0%",
    },
    {
      title: "Average Time",
      value: "40.2s", //Averae time our system is taking for assignment
    },
    {
      title: "pending Assignments",
      value: "3",
    },
  ];
  useEffect(() => {
    setMetricsDataState(metricsData);
  }, []);

  return (
    <div className="flex justify-center items-center w-screen">
      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsDataState.map((eachmetric, index) => (
          <Card className="flex-1 min-w-[250px] " key={index}>
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-2xl">{eachmetric.title}</CardTitle>
                <CardDescription className="p-4 text-5xl">
                  {eachmetric.value}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
