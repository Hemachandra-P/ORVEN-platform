import { useEffect, useState } from "react";

export default function ProjectModal({
    isOpen,
    project,
    loading,
    onClose,
    onSave,
}) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        organization_id: "",
        is_active: true,
    });

    useEffect(() => {
        if (project) {
            setForm({
                name: project.name || "",
                description: project.description || "",
                organization_id: project.organization_id || "",
                is_active: project.is_active,
            });
        } else {
            setForm({
                name: "",
                description: "",
                organization_id: "",
                is_active: true,
            });
        }
    }, [project, isOpen]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            organization_id: Number(form.organization_id),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

                <h2 className="text-2xl font-bold mb-6">
                    {project ? "Edit Project" : "Create Project"}
                </h2>

                <form onSubmit={submit} className="space-y-4">

                    <input
                        className="w-full border rounded-xl p-3"
                        placeholder="Project Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <textarea
                        className="w-full border rounded-xl p-3"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        className="w-full border rounded-xl p-3"
                        placeholder="Organization ID"
                        value={form.organization_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                organization_id: e.target.value,
                            })
                        }
                    />

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    is_active: e.target.checked,
                                })
                            }
                        />
                        Active
                    </label>

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
                        >
                            {loading
                                ? "Saving..."
                                : project
                                    ? "Update"
                                    : "Create"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}