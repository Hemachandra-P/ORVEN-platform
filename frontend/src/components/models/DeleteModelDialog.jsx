export default function DeleteModelDialog({
    isOpen,
    model,
    loading,
    onClose,
    onDelete,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[420px]">

                <h2 className="text-xl font-bold mb-3">
                    Delete Model
                </h2>

                <p className="text-slate-600">
                    Delete <strong>{model?.name}</strong> ?
                </p>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="border px-5 py-2 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => onDelete(model.id)}
                        className="bg-red-600 text-white px-5 py-2 rounded-xl"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>
        </div>
    );
}