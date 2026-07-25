import { Pencil, Trash2, Play, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EvaluationTable({
    evaluations,
    projects,
    datasets,
    models,
    onEdit,
    onDelete,
    onRun,
}) {
    const navigate = useNavigate();

    const getProjectName = (id) =>
        projects.find((p) => p.id === id)?.name || `#${id}`;

    const getDatasetName = (id) =>
        datasets.find((d) => d.id === id)?.name || `#${id}`;

    const getModelName = (id) =>
        models.find((m) => m.id === id)?.name || `#${id}`;

    if (!evaluations.length) {
        return (
            <div className="py-16 text-center">
                <h2 className="text-xl font-semibold">
                    No Evaluations Found
                </h2>

                <p className="text-slate-500 mt-2">
                    Create your first evaluation.
                </p>
            </div>
        );
    }

    return (
        <table className="w-full">
            <thead className="bg-slate-100">
                <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Project</th>
                    <th className="p-4 text-left">Dataset</th>
                    <th className="p-4 text-left">Model</th>
                    <th className="p-4 text-left">Created</th>
                    <th className="p-4 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {evaluations.map((evaluation) => (
                    <tr
                        key={evaluation.id}
                        className="border-t hover:bg-slate-50"
                    >
                        <td className="p-4 font-semibold">
                            {evaluation.name}
                        </td>

                        <td className="p-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm
                                ${evaluation.status === "COMPLETED"
                                        ? "bg-green-100 text-green-700"
                                        : evaluation.status === "RUNNING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : evaluation.status === "FAILED"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {evaluation.status}
                            </span>
                        </td>

                        <td className="p-4">
                            {getProjectName(evaluation.project_id)}
                        </td>

                        <td className="p-4">
                            {getDatasetName(evaluation.dataset_id)}
                        </td>

                        <td className="p-4">
                            {getModelName(evaluation.model_id)}
                        </td>

                        <td className="p-4">
                            {evaluation.created_at
                                ? new Date(
                                    evaluation.created_at
                                ).toLocaleDateString()
                                : "-"}
                        </td>

                        <td className="p-4">
                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() => onRun?.(evaluation)}
                                    className="p-2 rounded hover:bg-green-100"
                                    title="Run Evaluation"
                                >
                                    <Play
                                        size={18}
                                        className="text-green-600"
                                    />
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/evaluations/${evaluation.id}/report`
                                        )
                                    }
                                    className="p-2 rounded hover:bg-indigo-100"
                                    title="View Report"
                                >
                                    <Eye
                                        size={18}
                                        className="text-indigo-600"
                                    />
                                </button>

                                <button
                                    onClick={() => onEdit(evaluation)}
                                    className="p-2 rounded hover:bg-blue-100"
                                    title="Edit"
                                >
                                    <Pencil
                                        size={18}
                                        className="text-blue-600"
                                    />
                                </button>

                                <button
                                    onClick={() => onDelete(evaluation)}
                                    className="p-2 rounded hover:bg-red-100"
                                    title="Delete"
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