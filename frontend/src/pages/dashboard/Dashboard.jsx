import DashboardHeader from "../../components/dashboard/DashboardHeader";
import KPISection from "../../components/dashboard/KPISection";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import AIMetrics from "../../components/dashboard/AIMetrics";

export default function Dashboard() {
    return (
        <>
            <DashboardHeader />

            <div className="mt-8">
                <KPISection />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="col-span-2">
                    <AnalyticsChart />
                </div>

                <RecentActivity />
            </div>

            <div className="mt-8">
                <QuickActions />
            </div>
            <div className="mt-8">
                <AIMetrics />
            </div>
        </>
    );
}