const DeleteProjectDialog = ({
    isOpen,
    project,
    onClose,
    onDelete,
    loading = false,
}) => {
    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <span className="text-red-600 text-xl">🗑</span>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            Delete Project
                        </h2>

                        <p className="text-sm text-gray-500">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">

                    <p className="text-gray-700">
                        Are you sure you want to delete
                    </p>

                    <p className="font-bold text-red-600 text-lg mt-2">
                        {project.name}
                    </p>

                </div>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onDelete(project.id)}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DeleteProjectDialog;