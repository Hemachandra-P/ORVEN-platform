import { useState, useRef, useEffect } from "react";
import {
    CircleUserRound,
    User,
    Settings,
    LogOut,
} from "lucide-react";
import {
    Plus,
    ChevronDown,
    FolderKanban,
    Bot,
    Database,
    FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [quickOpen, setQuickOpen] = useState(false);

    const profileRef = useRef(null);
    const quickRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }

            if (
                quickRef.current &&
                !quickRef.current.contains(event.target)
            ) {
                setQuickOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">

            <div className="ml-auto flex items-center gap-4">
                <div className="relative" ref={quickRef}>

                    <button
                        onClick={() => setQuickOpen(!quickOpen)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                    >
                        <Plus size={18} />
                        <span>New</span>
                        <ChevronDown size={16} />
                    </button>

                    {quickOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-xl overflow-hidden z-50">

                            <button
                                onClick={() => {
                                    navigate("/projects");
                                    setQuickOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                            >
                                <FolderKanban size={18} />
                                New Project
                            </button>

                            <button
                                onClick={() => {
                                    navigate("/models");
                                    setQuickOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                            >
                                <Bot size={18} />
                                Register AI Model
                            </button>

                            <button
                                onClick={() => {
                                    navigate("/datasets");
                                    setQuickOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                            >
                                <Database size={18} />
                                New Dataset
                            </button>

                            <button
                                onClick={() => {
                                    navigate("/documents");
                                    setQuickOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                            >
                                <FileText size={18} />
                                Upload Document
                            </button>

                        </div>
                    )}

                </div>

                {/* Profile */}

                <div
                    className="relative"
                    ref={profileRef}
                >

                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                    >
                        <CircleUserRound
                            size={40}
                            className="text-slate-700 flex-shrink-0"
                        />

                        <div className="text-left leading-tight">
                            <h4 className="font-semibold text-sm">
                                Admin
                            </h4>

                            <p className="text-xs text-slate-500">
                                AI Governance
                            </p>
                        </div>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-xl overflow-hidden z-50">

                            <button
                                onClick={() => {
                                    navigate("/settings");
                                    setProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100"
                            >
                                <Settings size={18} />
                                Settings
                            </button>

                            <hr />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </header>
    );
}