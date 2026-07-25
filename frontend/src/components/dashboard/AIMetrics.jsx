import { useEffect, useState } from "react";
import {
    Cpu,
    Coins,
    Timer,
    CheckCircle,
} from "lucide-react";

import { getDashboardMetrics } from "../../services/dashboardService";

export default function AIMetrics() {

    const [metrics, setMetrics] = useState(null);

    useEffect(() => {

        async function load() {
            const data = await getDashboardMetrics();
            setMetrics(data);
        }

        load();

    }, []);

    if (!metrics) return null;

    const cards = [
        {
            title: "Total Tokens",
            value: metrics.total_tokens,
            icon: Cpu,
        },
        {
            title: "Average Latency",
            value: `${metrics.average_latency} ms`,
            icon: Timer,
        },
        {
            title: "Completed",
            value: metrics.completed_evaluations,
            icon: CheckCircle,
        },
        {
            title: "Total Cost",
            value: `$${metrics.total_cost}`,
            icon: Coins,
        },
    ];

    return (

        <div className="grid grid-cols-4 gap-6 mt-8">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="bg-white rounded-2xl border shadow-sm p-6"
                    >

                        <div className="flex justify-between">

                            <h3 className="text-slate-500">
                                {card.title}
                            </h3>

                            <Icon size={20} />

                        </div>

                        <h1 className="text-3xl font-bold mt-4">
                            {card.value}
                        </h1>

                    </div>

                );

            })}

        </div>

    );

}