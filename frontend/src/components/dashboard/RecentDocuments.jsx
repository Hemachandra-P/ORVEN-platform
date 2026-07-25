import { FileText } from "lucide-react";

const documents = [
    {
        name: "AI Governance Policy.pdf",
        uploadedBy: "Admin",
        date: "Today",
    },
    {
        name: "Risk Assessment.xlsx",
        uploadedBy: "John",
        date: "Yesterday",
    },
    {
        name: "Model Evaluation Report.pdf",
        uploadedBy: "Sarah",
        date: "2 Days Ago",
    },
    {
        name: "LLM Dataset.csv",
        uploadedBy: "Admin",
        date: "3 Days Ago",
    },
];

export default function RecentDocuments() {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6">

            <h2 className="text-xl font-semibold mb-6">
                Recent Documents
            </h2>

            <div className="space-y-4">

                {documents.map((doc, index) => (

                    <div
                        key={index}
                        className="flex items-center justify-between border-b pb-3 last:border-0"
                    >

                        <div className="flex items-center gap-3">

                            <div className="bg-blue-100 p-2 rounded-lg">

                                <FileText
                                    className="text-blue-600"
                                    size={18}
                                />

                            </div>

                            <div>

                                <h4 className="font-medium">
                                    {doc.name}
                                </h4>

                                <p className="text-sm text-slate-500">
                                    {doc.uploadedBy}
                                </p>

                            </div>

                        </div>

                        <span className="text-sm text-slate-400">
                            {doc.date}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}