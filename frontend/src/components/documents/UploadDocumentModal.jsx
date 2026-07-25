import { useState } from "react";

export default function UploadDocumentModal({
    isOpen,
    loading,
    onClose,
    onUpload,
}) {

    const [file, setFile] = useState(null);

    if (!isOpen) return null;

    const submit = (e) => {

        e.preventDefault();

        if (!file) return;

        onUpload(file);

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl w-[520px] p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Upload Document

                </h2>

                <form
                    onSubmit={submit}
                    className="space-y-6"
                >

                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full border rounded-xl p-3"
                    />

                    {file && (

                        <div className="text-sm text-slate-500">

                            Selected:

                            <strong> {file.name}</strong>

                        </div>

                    )}

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
                            {loading ? "Uploading..." : "Upload"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}