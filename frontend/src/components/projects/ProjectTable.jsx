import { Pencil, Trash2 } from "lucide-react";

export default function ProjectTable({
    projects,
    onEdit,
    onDelete,
}) {
    if (!projects.length) {
        return (
            <div className="py-16 text-center">
                <h2 className="text-xl font-semibold text-slate-700">
                    No Projects Found
                </h2>

                <p className="text-slate-500 mt-2">
                    Create your first project.
                </p>
            </div>
        );
    }

    return (
        <table className="w-full">
            <thead className="bg-slate-100">
                <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Project</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-left">Organization</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {projects.map((project) => (
                    <tr
                        key={project.id}
                        className="border-t hover:bg-slate-50"
                    >
                        <td className="p-4">{project.id}</td>

                        <td className="p-4 font-semibold">
                            {project.name}
                        </td>

                        <td className="p-4">
                            {project.description}
                        </td>

                        <td className="p-4">
                            #{project.organization_id}
                        </td>

                        <td className="p-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${project.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {project.is_active ? "Active" : "Inactive"}
                            </span>
                        </td>

                        <td className="p-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(project)}
                                    className="p-2 rounded hover:bg-blue-100"
                                >
                                    <Pencil
                                        size={18}
                                        className="text-blue-600"
                                    />
                                </button>

                                <button
                                    onClick={() => onDelete(project)}
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