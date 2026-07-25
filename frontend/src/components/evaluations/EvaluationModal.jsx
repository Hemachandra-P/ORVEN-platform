import { useEffect, useState } from "react";

import { getProjects } from "../../services/projectService";
import { getDatasets } from "../../services/datasetService";
import { getModels } from "../../services/modelService";

export default function EvaluationModal({
    isOpen,
    evaluation,
    loading,
    onClose,
    onSave,
}) {

    const initialState = {
        name: "",
        project_id: "",
        dataset_id: "",
        model_id: "",
    };

    const [form, setForm] = useState(initialState);

    const [projects, setProjects] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [models, setModels] = useState([]);

    useEffect(() => {

        if (!isOpen) return;

        async function loadDropdowns() {

            try {

                const [projectData, datasetData, modelData] =
                    await Promise.all([
                        getProjects(),
                        getDatasets(),
                        getModels(),
                    ]);

                setProjects(projectData);
                setDatasets(datasetData);
                setModels(modelData);

            } catch (err) {

                console.error(err);

            }

        }

        loadDropdowns();

    }, [isOpen]);

    useEffect(() => {

        if (evaluation) {

            setForm({
                name: evaluation.name || "",
                project_id: evaluation.project_id || "",
                dataset_id: evaluation.dataset_id || "",
                model_id: evaluation.model_id || "",
            });

        } else {

            setForm(initialState);

        }

    }, [evaluation, isOpen]);

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
            project_id: Number(form.project_id),
            dataset_id: Number(form.dataset_id),
            model_id: Number(form.model_id),
        });

    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">

            <div className="bg-white rounded-2xl w-full max-w-2xl p-8">

                <h2 className="text-2xl font-bold mb-6">
                    {evaluation ? "Edit Evaluation" : "Create Evaluation"}
                </h2>

                <form onSubmit={submit} className="space-y-5">

                    <input
                        name="name"
                        placeholder="Evaluation Name"
                        className="border rounded-xl p-3 w-full"
                        value={form.name}
                        onChange={change}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <select
                            name="project_id"
                            className="border rounded-xl p-3"
                            value={form.project_id}
                            onChange={change}
                            required
                        >
                            <option value="">Select Project</option>

                            {projects.map((project) => (
                                <option
                                    key={project.id}
                                    value={project.id}
                                >
                                    {project.name}
                                </option>
                            ))}

                        </select>

                        <select
                            name="dataset_id"
                            className="border rounded-xl p-3"
                            value={form.dataset_id}
                            onChange={change}
                            required
                        >
                            <option value="">Select Dataset</option>

                            {datasets.map((dataset) => (
                                <option
                                    key={dataset.id}
                                    value={dataset.id}
                                >
                                    {dataset.name}
                                </option>
                            ))}

                        </select>

                        <select
                            name="model_id"
                            className="border rounded-xl p-3"
                            value={form.model_id}
                            onChange={change}
                            required
                        >
                            <option value="">Select AI Model</option>

                            {models.map((model) => (
                                <option
                                    key={model.id}
                                    value={model.id}
                                >
                                    {model.name}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-6 py-2 rounded-xl hover:bg-slate-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                        >
                            {loading
                                ? "Saving..."
                                : evaluation
                                    ? "Update Evaluation"
                                    : "Create Evaluation"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}