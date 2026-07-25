import { useState } from "react";
import {
    UserCircle,
    Shield,
    Info,
    LogOut,
    Mail,
    Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    const handlePasswordChange = async () => {

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);

            alert("Password updated successfully.");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(error);
            alert("Failed to update password.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">

            <h1 className="text-3xl font-bold text-slate-800">
                Settings
            </h1>

            {/* Account */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <UserCircle size={28} className="text-blue-600" />
                    <h2 className="text-xl font-semibold">Account</h2>
                </div>

                <div className="space-y-5">

                    <div className="flex justify-between border-b pb-3">
                        <span className="font-medium text-slate-600">Name</span>
                        <span>AI Governance Admin</span>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                        <span className="font-medium text-slate-600">Email</span>
                        <span>admin@neurostack.ai</span>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                        <span className="font-medium text-slate-600">Role</span>
                        <span>Administrator</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium text-slate-600">Organization</span>
                        <span>NeuroStack</span>
                    </div>

                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield size={28} className="text-blue-600" />
                    <h2 className="text-xl font-semibold">Security</h2>
                </div>

                <div className="space-y-4 text-slate-700">
                    <div className="flex justify-between border-b pb-3">
                        <span className="font-medium">Authentication</span>
                        <span>JWT Bearer Token</span>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                        <span className="font-medium">Access Level</span>
                        <span>Administrator</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Status</span>
                        <span className="text-green-600 font-medium">Secure</span>
                    </div>
                </div>
            </div>
            {/* About */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Info size={28} className="text-blue-600" />
                    <h2 className="text-xl font-semibold">About</h2>
                </div>

                <div className="space-y-3 text-slate-700">
                    <div className="flex justify-between">
                        <span className="font-medium">Platform</span>
                        <span>NeuroStack</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Version</span>
                        <span>v1.0.0</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Build</span>
                        <span>2026.1.0</span>
                    </div>

                    <div className="pt-3 border-t text-sm text-slate-500">
                        Enterprise AI Governance Platform
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="flex justify-center pt-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

        </div>
    );
}