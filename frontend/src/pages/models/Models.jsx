import { useEffect, useState } from "react";

import SearchBar from "../../components/organizations/SearchBar";
import ModelTable from "../../components/models/ModelTable";
import ModelModal from "../../components/models/ModelModal";
import DeleteModelDialog from "../../components/models/DeleteModelDialog";

import {
    getModels,
    createModel,
    updateModel,
    deleteModel,
} from "../../services/modelService";

export default function Models() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadModels();
    }, []);

    async function loadModels() {
        try {
            setLoading(true);

            const data = await getModels();

            setModels(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filtered = models.filter((model) =>
        model.name.toLowerCase().includes(search.toLowerCase()) ||
        model.provider.toLowerCase().includes(search.toLowerCase()) ||
        model.model_id.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedModel(null);
        setOpenModal(true);
    };

    const handleEdit = (model) => {
        setSelectedModel(model);
        setOpenModal(true);
    };

    const handleSave = async (data) => {
        try {
            setSaving(true);

            if (selectedModel) {
                await updateModel(selectedModel.id, data);
            } else {
                await createModel(data);
            }

            setOpenModal(false);
            setSelectedModel(null);

            await loadModels();

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (model) => {
        setSelectedModel(model);
        setDeleteDialog(true);
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(true);

            await deleteModel(id);

            setDeleteDialog(false);
            setSelectedModel(null);

            await loadModels();

        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-lg font-semibold">
                Loading Models...
            </div>
        );
    }

    return (
        <>
            <ModelModal
                isOpen={openModal}
                model={selectedModel}
                loading={saving}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedModel(null);
                }}
                onSave={handleSave}
            />

            <DeleteModelDialog
                isOpen={deleteDialog}
                model={selectedModel}
                loading={deleting}
                onClose={() => {
                    setDeleteDialog(false);
                    setSelectedModel(null);
                }}
                onDelete={handleDelete}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        AI Models
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage all AI Models.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                    + Create Model
                </button>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                />
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <ModelTable
                    models={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </div>
        </>
    );
}