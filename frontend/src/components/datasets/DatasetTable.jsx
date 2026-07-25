import { Pencil, Trash2 } from "lucide-react";

export default function DatasetTable({
    datasets,
    onEdit,
    onDelete,
}) {

    if (!datasets.length) {
        return (
            <div className="py-16 text-center">

                <h2 className="text-xl font-semibold">
                    No Datasets Found
                </h2>

                <p className="text-slate-500 mt-2">
                    Create your first dataset.
                </p>

            </div>
        );
    }

    return (

        <table className="w-full">

            <thead className="bg-slate-100">

                <tr>

                    <th className="p-4 text-left">Name</th>

                    <th className="p-4 text-left">Type</th>

                    <th className="p-4 text-left">Method</th>

                    <th className="p-4 text-left">Status</th>

                    <th className="p-4 text-left">Prompts</th>

                    <th className="p-4 text-left">Project</th>

                    <th className="p-4 text-left">Actions</th>

                </tr>

            </thead>

            <tbody>

                {datasets.map((dataset) => (

                    <tr
                        key={dataset.id}
                        className="border-t hover:bg-slate-50"
                    >

                        <td className="p-4 font-semibold">
                            {dataset.name}
                        </td>

                        <td className="p-4">
                            {dataset.dataset_type}
                        </td>

                        <td className="p-4">
                            {dataset.creation_method}
                        </td>

                        <td className="p-4">

                            <span
                                className={`px-3 py-1 rounded-full text-sm
                                ${dataset.status === "READY"
                                        ? "bg-green-100 text-green-700"
                                        : dataset.status === "CREATING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {dataset.status}
                            </span>

                        </td>

                        <td className="p-4">
                            {dataset.total_prompts}
                        </td>

                        <td className="p-4">
                            #{dataset.project_id}
                        </td>

                        <td className="p-4">

                            <div className="flex gap-2">

                                <button
                                    onClick={() => onEdit(dataset)}
                                    className="p-2 rounded hover:bg-blue-100"
                                >
                                    <Pencil
                                        size={18}
                                        className="text-blue-600"
                                    />
                                </button>

                                <button
                                    onClick={() => onDelete(dataset)}
                                    className="p-2 rounded hover:bg-red-100"
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