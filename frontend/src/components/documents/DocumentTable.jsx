import { Trash2 } from "lucide-react";

export default function DocumentTable({
    documents,
    onDelete,
}) {

    if (!documents.length) {

        return (

            <div className="py-16 text-center">

                <h2 className="text-xl font-semibold">

                    No Documents Uploaded

                </h2>

                <p className="text-slate-500 mt-2">

                    Upload your first document.

                </p>

            </div>

        );

    }

    return (

        <table className="w-full">

            <thead className="bg-slate-100">

                <tr>

                    <th className="p-4 text-left">

                        Filename

                    </th>

                    <th className="p-4 text-left">

                        Type

                    </th>

                    <th className="p-4 text-left">

                        Size

                    </th>

                    <th className="p-4 text-left">

                        Uploaded

                    </th>

                    <th className="p-4 text-left">

                        Actions

                    </th>

                </tr>

            </thead>

            <tbody>

                {documents.map((doc) => (

                    <tr
                        key={doc.id}
                        className="border-t hover:bg-slate-50"
                    >

                        <td className="p-4 font-semibold">

                            {doc.filename}

                        </td>

                        <td className="p-4">

                            {doc.filetype || doc.file_type}

                        </td>

                        <td className="p-4">

                            {doc.filesize || doc.file_size} bytes

                        </td>

                        <td className="p-4">

                            {new Date(doc.created_at).toLocaleString()}

                        </td>

                        <td className="p-4">

                            <button
                                onClick={() => onDelete(doc)}
                                className="p-2 rounded hover:bg-red-100"
                            >

                                <Trash2
                                    size={18}
                                    className="text-red-600"
                                />

                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}