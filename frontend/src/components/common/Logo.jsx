import { BrainCircuit } from "lucide-react";

export default function Logo() {
    return (
        <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">

                <BrainCircuit
                    size={26}
                    className="text-white"
                />

            </div>

            <div>

                <h1 className="text-2xl font-bold text-white">
                    NeuroStack
                </h1>

                <p className="text-xs text-slate-400">
                    Enterprise AI Platform
                </p>

            </div>

        </div>
    );
}