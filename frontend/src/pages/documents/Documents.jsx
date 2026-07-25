import { useEffect, useState } from "react";

import SearchBar from "../../components/organizations/SearchBar";

import DocumentTable from "../../components/documents/DocumentTable";
import UploadDocumentModal from "../../components/documents/UploadDocumentModal";
import DeleteDocumentDialog from "../../components/documents/DeleteDocumentDialog";

import {
    getDocuments,
    uploadDocument,
    deleteDocument,
} from "../../services/documentService";

export default function Documents() {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [uploadModal, setUploadModal] = useState(false);

    const [selectedDocument, setSelectedDocument] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {

        try {

            setLoading(true);

            const data = await getDocuments();

            setDocuments(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    const filtered = documents.filter((doc) =>
        doc.filename.toLowerCase().includes(search.toLowerCase()) ||
        (doc.file_type || "").toLowerCase().includes(search.toLowerCase())
    );

    const handleUpload = async (file) => {

        try {

            setUploading(true);

            await uploadDocument(file);

            setUploadModal(false);

            await loadDocuments();

        } catch (err) {

            console.error(err);

        } finally {

            setUploading(false);

        }

    };

    const handleDeleteClick = (doc) => {

        setSelectedDocument(doc);

        setDeleteDialog(true);

    };

    const handleDelete = async (id) => {

        try {

            setDeleting(true);

            await deleteDocument(id);

            setDeleteDialog(false);

            setSelectedDocument(null);

            await loadDocuments();

        } catch (err) {

            console.error(err);

        } finally {

            setDeleting(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-10 text-lg font-semibold">

                Loading Documents...

            </div>

        );

    }

    return (

        <>

            <UploadDocumentModal
                isOpen={uploadModal}
                loading={uploading}
                onClose={() => setUploadModal(false)}
                onUpload={handleUpload}
            />

            <DeleteDocumentDialog
                isOpen={deleteDialog}
                document={selectedDocument}
                loading={deleting}
                onClose={() => {
                    setDeleteDialog(false);
                    setSelectedDocument(null);
                }}
                onDelete={handleDelete}
            />

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        Documents

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Upload and manage knowledge documents.

                    </p>

                </div>

                <button
                    onClick={() => setUploadModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >

                    + Upload Document

                </button>

            </div>

            <div className="mb-6">

                <SearchBar
                    value={search}
                    onChange={setSearch}
                />

            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                <DocumentTable
                    documents={filtered}
                    onDelete={handleDeleteClick}
                />

            </div>

        </>

    );

}