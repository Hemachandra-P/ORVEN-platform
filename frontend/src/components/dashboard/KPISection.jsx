import { useEffect, useState } from "react";
import {
    FolderKanban,
    Bot,
    Database,
    ClipboardCheck,
} from "lucide-react";

import { getDashboardMetrics } from "../../services/dashboardService";
import StatCard from "../common/StatCard";

export default function KPISection() {

    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getDashboardMetrics();
                setMetrics(data);
            } catch (err) {
                console.error(err);
            }
        }

        load();
    }, []);

    if (!metrics) {
        return (
            <div className="text-slate-500">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-6">

            <StatCard
                title="Projects"
                value={metrics.total_projects}
                color="bg-blue-100"
                icon={<FolderKanban className="text-blue-600" />}
            />

            <StatCard
                title="AI Models"
                value={metrics.total_models}
                color="bg-purple-100"
                icon={<Bot className="text-purple-600" />}
            />

            <StatCard
                title="Datasets"
                value={metrics.total_datasets}
                color="bg-orange-100"
                icon={<Database className="text-orange-600" />}
            />

            <StatCard
                title="Evaluations"
                value={metrics.total_evaluations}
                color="bg-green-100"
                icon={<ClipboardCheck className="text-green-600" />}
            />

        </div>
    );
}