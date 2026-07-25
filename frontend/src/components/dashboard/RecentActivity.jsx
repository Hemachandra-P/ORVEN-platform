import {
    CheckCircle2,
    FileText,
    Bot,
    FolderKanban,
} from "lucide-react";

const activities = [
    {
        icon: FolderKanban,
        title: "New Project Created",
        description: "Customer Support AI",
        time: "2 mins ago",
        color: "text-blue-600",
    },
    {
        icon: Bot,
        title: "AI Model Registered",
        description: "Llama 3.1 70B",
        time: "15 mins ago",
        color: "text-purple-600",
    },
    {
        icon: FileText,
        title: "Dataset Uploaded",
        description: "Risk Assessment Dataset",
        time: "1 hour ago",
        color: "text-orange-600",
    },
    {
        icon: CheckCircle2,
        title: "Evaluation Completed",
        description: "Policy Compliance Check",
        time: "2 hours ago",
        color: "text-green-600",
    },
];

export default function RecentActivity() {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6 h-[420px]">

            <h2 className="text-xl font-semibold mb-6">
                Recent Activity
            </h2>

            <div className="space-y-5">

                {activities.map((activity, index) => {
                    const Icon = activity.icon;

                    return (
                        <div
                            key={index}
                            className="flex gap-4"
                        >

                            <div className={`mt-1 ${activity.color}`}>
                                <Icon size={22} />
                            </div>

                            <div>

                                <h4 className="font-medium">
                                    {activity.title}
                                </h4>

                                <p className="text-sm text-slate-500">
                                    {activity.description}
                                </p>

                                <span className="text-xs text-slate-400">
                                    {activity.time}
                                </span>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}