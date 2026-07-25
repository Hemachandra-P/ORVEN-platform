import {
    Search,
    Bell,
    CircleUserRound,
    Moon,
} from "lucide-react";

export default function Navbar() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">

            {/* Search */}

            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl w-[420px]">

                <Search
                    size={18}
                    className="text-slate-500"
                />

                <input
                    type="text"
                    placeholder="Search organizations, projects, models..."
                    className="bg-transparent outline-none flex-1 text-sm"
                />

            </div>

            {/* Right */}

            <div className="flex items-center gap-5">

                <button className="hover:text-blue-600 transition">
                    <Moon size={20} />
                </button>

                <button className="relative hover:text-blue-600 transition">

                    <Bell size={21} />

                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>

                </button>

                <div className="flex items-center gap-3">

                    <CircleUserRound
                        size={38}
                        className="text-slate-700"
                    />

                    <div>

                        <h4 className="font-semibold">
                            Admin
                        </h4>

                        <p className="text-xs text-slate-500">
                            AI Governance
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}