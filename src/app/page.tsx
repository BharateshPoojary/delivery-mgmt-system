"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import axios from "axios";
const HomePage = () => {
  try {
    const metricsData = async () => {
      const getMetricResponse = await axios.get("/api/assignments/metrics");
      if (getMetricResponse.data) {
      }
    };
    useEffect(() => {
      metricsData();
    }, []);
  } catch (error) {}
  return (
    <div>
      <Card className="w-[350px] m-4">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-2xl">Total Assigned</CardTitle>
            <CardDescription className="p-8 text-5xl">1</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default HomePage;
