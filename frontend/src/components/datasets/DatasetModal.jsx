import { useEffect, useState } from "react";

export default function DatasetModal({
    isOpen,
    dataset,
    loading,
    onClose,
    onSave,
}) {
    const initialState = {
        name: "",
        description: "",
        dataset_type: "QA",
        creation_method: "MANUAL",
        status: "READY",
        total_prompts: 0,
        file_name: "",
        file_path: "",
        project_id: 1,
    };

    const [form, setForm] = useState(initialState);

    useEffect(() => {
        if (dataset) {
            setForm({
                name: dataset.name || "",
                description: dataset.description || "",
                dataset_type: dataset.dataset_type || "QA",
                creation_method: dataset.creation_method || "MANUAL",
                status: dataset.status || "READY",
                total_prompts: dataset.total_prompts || 0,
                file_name: dataset.file_name || "",
                file_path: dataset.file_path || "",
                project_id: dataset.project_id || 1,
            });
        } else {
            setForm(initialState);
        }
    }, [dataset, isOpen]);

    if (!isOpen) return null;

    const change = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        onSave({
            ...form,
            total_prompts: Number(form.total_prompts),
            project_id: Number(form.project_id),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">

            <div className="bg-white rounded-2xl w-full max-w-3xl p-8 my-10">

                <h2 className="text-2xl font-bold mb-6">
                    {dataset ? "Edit Dataset" : "Create Dataset"}
                </h2>

                <form onSubmit={submit} className="space-y-5">

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            name="name"
                            placeholder="Dataset Name"
                            className="border rounded-xl p-3"
                            value={form.name}
                            onChange={change}
                        />

                        <input
                            name="project_id"
                            type="number"
                            placeholder="Project ID"
                            className="border rounded-xl p-3"
                            value={form.project_id}
                            onChange={change}
                        />

                        <select
                            name="dataset_type"
                            className="border rounded-xl p-3"
                            value={form.dataset_type}
                            onChange={change}
                        >
                            <option value="QA">QA</option>
                        </select>

                        <select
                            name="creation_method"
                            className="border rounded-xl p-3"
                            value={form.creation_method}
                            onChange={change}
                        >
                            <option value="MANUAL">MANUAL</option>
                            <option value="AI_GENERATED">AI_GENERATED</option>
                        </select>

                        <select
                            name="status"
                            className="border rounded-xl p-3"
                            value={form.status}
                            onChange={change}
                        >
                            <option value="READY">READY</option>
                            <option value="CREATING">CREATING</option>
                        </select>

                        <input
                            name="total_prompts"
                            type="number"
                            className="border rounded-xl p-3"
                            value={form.total_prompts}
                            onChange={change}
                        />

                        <input
                            name="file_name"
                            placeholder="File Name"
                            className="border rounded-xl p-3"
                            value={form.file_name}
                            onChange={change}
                        />

                        <input
                            name="file_path"
                            placeholder="File Path"
                            className="border rounded-xl p-3"
                            value={form.file_path}
                            onChange={change}
                        />

                    </div>

                    <textarea
                        name="description"
                        placeholder="Description"
                        rows={4}
                        className="border rounded-xl p-3 w-full"
                        value={form.description}
                        onChange={change}
                    />

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-6 py-2 rounded-xl"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl"
                        >
                            {loading
                                ? "Saving..."
                                : dataset
                                    ? "Update Dataset"
                                    : "Create Dataset"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}