import { useEffect, useState } from "react";

export default function ModelModal({
    isOpen,
    model,
    loading,
    onClose,
    onSave,
}) {

    const initialState = {
        name: "",
        provider: "openai",
        model_id: "",
        description: "",
        endpoint: "",
        context_window: 8192,
        supports_vision: false,
        supports_tool_calling: true,
        supports_streaming: true,
        temperature: 0.7,
        max_tokens: 4096,
        project_id: 1,
        is_active: true,
    };

    const [form, setForm] = useState(initialState);

    useEffect(() => {
        if (model) {
            setForm({
                name: model.name || "",
                provider: model.provider || "openai",
                model_id: model.model_id || "",
                description: model.description || "",
                endpoint: model.endpoint || "",
                context_window: model.context_window || 8192,
                supports_vision: model.supports_vision,
                supports_tool_calling: model.supports_tool_calling,
                supports_streaming: model.supports_streaming,
                temperature: model.temperature,
                max_tokens: model.max_tokens,
                project_id: model.project_id,
                is_active: model.is_active,
            });
        } else {
            setForm(initialState);
        }
    }, [model, isOpen]);

    if (!isOpen) return null;

    const change = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        onSave({
            ...form,
            context_window: Number(form.context_window),
            max_tokens: Number(form.max_tokens),
            project_id: Number(form.project_id),
            temperature: Number(form.temperature),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">

            <div className="bg-white rounded-2xl w-full max-w-3xl p-8 my-10">

                <h2 className="text-2xl font-bold mb-6">
                    {model ? "Edit AI Model" : "Create AI Model"}
                </h2>

                <form onSubmit={submit} className="space-y-5">

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            name="name"
                            placeholder="Model Name"
                            className="border rounded-xl p-3"
                            value={form.name}
                            onChange={change}
                        />

                        <input
                            name="provider"
                            placeholder="Provider"
                            className="border rounded-xl p-3"
                            value={form.provider}
                            onChange={change}
                        />

                        <input
                            name="model_id"
                            placeholder="Model ID"
                            className="border rounded-xl p-3"
                            value={form.model_id}
                            onChange={change}
                        />

                        <input
                            name="endpoint"
                            placeholder="Endpoint"
                            className="border rounded-xl p-3"
                            value={form.endpoint}
                            onChange={change}
                        />

                        <input
                            name="context_window"
                            type="number"
                            placeholder="Context Window"
                            className="border rounded-xl p-3"
                            value={form.context_window}
                            onChange={change}
                        />

                        <input
                            name="max_tokens"
                            type="number"
                            placeholder="Max Tokens"
                            className="border rounded-xl p-3"
                            value={form.max_tokens}
                            onChange={change}
                        />

                        <input
                            name="temperature"
                            type="number"
                            step="0.1"
                            className="border rounded-xl p-3"
                            value={form.temperature}
                            onChange={change}
                        />

                        <input
                            name="project_id"
                            type="number"
                            className="border rounded-xl p-3"
                            value={form.project_id}
                            onChange={change}
                        />

                    </div>

                    <textarea
                        name="description"
                        placeholder="Description"
                        rows="3"
                        className="border rounded-xl p-3 w-full"
                        value={form.description}
                        onChange={change}
                    />

                    <div className="grid grid-cols-2 gap-4">

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="supports_vision"
                                checked={form.supports_vision}
                                onChange={change}
                            />
                            Supports Vision
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="supports_tool_calling"
                                checked={form.supports_tool_calling}
                                onChange={change}
                            />
                            Tool Calling
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="supports_streaming"
                                checked={form.supports_streaming}
                                onChange={change}
                            />
                            Streaming
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={change}
                            />
                            Active
                        </label>

                    </div>

                    <div className="flex justify-end gap-3 pt-4">

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
                                : model
                                    ? "Update Model"
                                    : "Create Model"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}