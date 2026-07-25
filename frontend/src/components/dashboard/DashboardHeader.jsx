import { CalendarDays } from "lucide-react";

export default function DashboardHeader() {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex items-center justify-between">

            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Dashboard
                </h1>

                <p className="text-slate-500 mt-2">
                    Welcome back! Here's an overview of your AI Governance Platform.
                </p>
            </div>

            <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 shadow-sm">

                <CalendarDays
                    size={18}
                    className="text-blue-600"
                />

                <span className="text-sm">
                    {today}
                </span>

            </div>

        </div>
    );
}