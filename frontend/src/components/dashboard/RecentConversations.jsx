import { MessageSquare } from "lucide-react";

const chats = [
    {
        title: "Explain AI Risk Assessment",
        time: "5 mins ago",
    },
    {
        title: "Summarize Governance Policy",
        time: "25 mins ago",
    },
    {
        title: "Compare Llama vs GPT",
        time: "Yesterday",
    },
];

export default function RecentConversations() {
    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6">

            <h2 className="text-xl font-semibold mb-6">
                Recent Conversations
            </h2>

            <div className="space-y-4">

                {chats.map((chat, index) => (

                    <div
                        key={index}
                        className="flex items-center justify-between border-b pb-3 last:border-0"
                    >

                        <div className="flex items-center gap-3">

                            <MessageSquare
                                className="text-green-600"
                                size={18}
                            />

                            <span className="font-medium">
                                {chat.title}
                            </span>

                        </div>

                        <span className="text-sm text-slate-400">
                            {chat.time}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}