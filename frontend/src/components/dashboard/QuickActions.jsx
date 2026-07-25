import {
    FolderPlus,
    Bot,
    Upload,
    MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
    {
        title: "New Project",
        icon: FolderPlus,
        color: "bg-blue-100 text-blue-600",
        path: "/projects",
    },
    {
        title: "Register AI Model",
        icon: Bot,
        color: "bg-purple-100 text-purple-600",
        path: "/models",
    },
    {
        title: "Upload Dataset",
        icon: Upload,
        color: "bg-orange-100 text-orange-600",
        path: "/datasets",
    },
    {
        title: "Open RAG Chat",
        icon: MessageSquare,
        color: "bg-green-100 text-green-600",
        path: "/chat",
    },
];

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6">

            <h2 className="text-xl font-semibold mb-6">
                Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-4">

                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.title}
                            onClick={() => navigate(action.path)}
                            className="border rounded-xl p-5 hover:shadow-md transition hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                                <Icon size={22} />
                            </div>

                            <h3 className="mt-4 font-semibold">
                                {action.title}
                            </h3>
                        </button>
                    );
                })}

            </div>

        </div>
    );
}