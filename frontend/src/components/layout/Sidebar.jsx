import {
    LayoutDashboard,
    Building2,
    FolderKanban,
    Bot,
    Database,
    FileText,
    ClipboardCheck,
    MessageSquare,
    BarChart3,
    Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "../common/Logo";

const menu = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },

    { icon: Building2, label: "Organizations", path: "/organizations" },
    { icon: FolderKanban, label: "Projects", path: "/projects" },
    { icon: Bot, label: "AI Models", path: "/models" },
    { icon: Database, label: "Datasets", path: "/datasets" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: ClipboardCheck, label: "Evaluations", path: "/evaluations" },
    { icon: MessageSquare, label: "RAG Chat", path: "/chat" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-slate-900 text-white p-6 border-r border-slate-800">

            <Logo />

            <div className="mb-10"></div>

            <div className="space-y-2">
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300 hover:bg-blue-600 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>

        </aside>
    );
}