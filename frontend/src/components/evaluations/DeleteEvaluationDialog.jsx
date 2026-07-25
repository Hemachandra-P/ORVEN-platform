export default function DeleteEvaluationDialog({
    isOpen,
    evaluation,
    loading,
    onClose,
    onDelete,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl w-full max-w-md p-8">

                <h2 className="text-2xl font-bold">
                    Delete Evaluation
                </h2>

                <p className="text-slate-500 mt-3">
                    Are you sure you want to delete
                    <span className="font-semibold">
                        {" "}
                        {evaluation?.name}
                    </span>
                    ?
                </p>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="border px-6 py-2 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => onDelete(evaluation.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}