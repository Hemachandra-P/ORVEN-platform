import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { getDashboardMetrics } from "../../services/dashboardService";

export default function AnalyticsChart() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        async function load() {
            const data = await getDashboardMetrics();

            setChartData([
                {
                    name: "Projects",
                    value: data.total_projects,
                },
                {
                    name: "Models",
                    value: data.total_models,
                },
                {
                    name: "Datasets",
                    value: data.total_datasets,
                },
                {
                    name: "Evaluations",
                    value: data.total_evaluations,
                },
            ]);
        }

        load();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-[420px]">

            <h2 className="text-xl font-semibold mb-6">
                Platform Overview
            </h2>

            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{
                            r: 6,
                            fill: "#2563eb",
                        }}
                    />

                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}