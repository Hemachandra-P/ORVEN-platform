import { Pencil, Trash2 } from "lucide-react";

export default function OrganizationTable({
    organizations,
    onEdit,
    onDelete,
}) {
    if (!organizations.length) {
        return (
            <div className="py-16 text-center">
                <h2 className="text-xl font-semibold text-slate-700">
                    No Organizations Found
                </h2>

                <p className="text-slate-500 mt-2">
                    Create your first organization to get started.
                </p>
            </div>
        );
    }

    return (
        <table className="w-full">
            <thead className="bg-slate-100">
                <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                </tr>
            </thead>

            <tbody>
                {organizations.map((org) => (
                    <tr
                        key={org.id}
                        className="border-t hover:bg-slate-50 transition-colors"
                    >
                        <td className="p-4">{org.id}</td>

                        <td className="p-4 font-semibold">
                            {org.name}
                        </td>

                        <td className="p-4 max-w-md truncate">
                            {org.description}
                        </td>

                        <td className="p-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${org.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {org.is_active ? "Active" : "Inactive"}
                            </span>
                        </td>

                        <td className="p-4">
                            <div className="flex gap-2">

                                <button
                                    onClick={() => onEdit(org)}
                                    className="p-2 rounded-lg hover:bg-blue-100 transition"
                                    title="Edit"
                                >
                                    <Pencil
                                        size={18}
                                        className="text-blue-600"
                                    />
                                </button>

                                <button
                                    onClick={() => onDelete(org)}
                                    className="p-2 rounded-lg hover:bg-red-100 transition"
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