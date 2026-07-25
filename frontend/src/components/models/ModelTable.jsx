import { Pencil, Trash2 } from "lucide-react";

export default function ModelTable({
    models,
    onEdit,
    onDelete,
}) {

    if (!models.length) {
        return (
            <div className="py-16 text-center">
                <h2 className="text-xl font-semibold">
                    No Models Found
                </h2>

                <p className="text-slate-500 mt-2">
                    Create your first AI model.
                </p>
            </div>
        );
    }

    return (
        <table className="w-full">

            <thead className="bg-slate-100">

                <tr>

                    <th className="p-4 text-left">Name</th>

                    <th className="p-4 text-left">Provider</th>

                    <th className="p-4 text-left">Model ID</th>

                    <th className="p-4 text-left">Context</th>

                    <th className="p-4 text-left">Project</th>

                    <th className="p-4 text-left">Status</th>

                    <th className="p-4 text-left">Actions</th>

                </tr>

            </thead>

            <tbody>

                {models.map((model) => (

                    <tr
                        key={model.id}
                        className="border-t hover:bg-slate-50"
                    >

                        <td className="p-4 font-semibold">
                            {model.name}
                        </td>

                        <td className="p-4">
                            {model.provider}
                        </td>

                        <td className="p-4">
                            {model.model_id}
                        </td>

                        <td className="p-4">
                            {model.context_window}
                        </td>

                        <td className="p-4">
                            #{model.project_id}
                        </td>

                        <td className="p-4">

                            <span
                                className={`px-3 py-1 rounded-full text-sm ${model.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {model.is_active ? "Active" : "Inactive"}
                            </span>

                        </td>

                        <td className="p-4">

                            <div className="flex gap-2">

                                <button
                                    onClick={() => onEdit(model)}
                                    className="p-2 hover:bg-blue-100 rounded"
                                >
                                    <Pencil
                                        size={18}
                                        className="text-blue-600"
                                    />
                                </button>

                                <button
                                    onClick={() => onDelete(model)}
                                    className="p-2 hover:bg-red-100 rounded"
                                >
                                    <Trash2
                                        size={18}
                                        className="text-red-600"
                                    />
                                </button>

                            </div>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>
    );
}