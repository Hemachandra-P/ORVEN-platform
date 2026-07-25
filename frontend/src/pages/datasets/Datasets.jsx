import { useEffect, useState } from "react";

import SearchBar from "../../components/organizations/SearchBar";
import DatasetTable from "../../components/datasets/DatasetTable";
import DatasetModal from "../../components/datasets/DatasetModal";
import DeleteDatasetDialog from "../../components/datasets/DeleteDatasetDialog";

import {
    getDatasets,
    createDataset,
    updateDataset,
    deleteDataset,
} from "../../services/datasetService";

export default function Datasets() {

    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadDatasets();
    }, []);

    async function loadDatasets() {
        try {
            setLoading(true);

            const data = await getDatasets();

            setDatasets(data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filtered = datasets.filter((dataset) =>
        dataset.name.toLowerCase().includes(search.toLowerCase()) ||
        dataset.dataset_type.toLowerCase().includes(search.toLowerCase()) ||
        dataset.creation_method.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedDataset(null);
        setOpenModal(true);
    };

    const handleEdit = (dataset) => {
        setSelectedDataset(dataset);
        setOpenModal(true);
    };

    const handleSave = async (data) => {

        try {

            setSaving(true);

            if (selectedDataset) {
                await updateDataset(selectedDataset.id, data);
            } else {
                await createDataset(data);
            }

            setOpenModal(false);
            setSelectedDataset(null);

            await loadDatasets();

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }

    };

    const handleDeleteClick = (dataset) => {
        setSelectedDataset(dataset);
        setDeleteDialog(true);
    };

    const handleDelete = async (id) => {

        try {

            setDeleting(true);

            await deleteDataset(id);

            setDeleteDialog(false);
            setSelectedDataset(null);

            await loadDatasets();

        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }

    };

    if (loading) {
        return (
            <div className="text-center py-10 text-lg font-semibold">
                Loading Datasets...
            </div>
        );
    }

    return (
        <>
            <DatasetModal
                isOpen={openModal}
                dataset={selectedDataset}
                loading={saving}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedDataset(null);
                }}
                onSave={handleSave}
            />

            <DeleteDatasetDialog
                isOpen={deleteDialog}
                dataset={selectedDataset}
                loading={deleting}
                onClose={() => {
                    setDeleteDialog(false);
                    setSelectedDataset(null);
                }}
                onDelete={handleDelete}
            />

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">
                        Datasets
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage all evaluation datasets.
                    </p>

                </div>

                <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                    + Create Dataset
                </button>

            </div>

            <div className="mb-6">

                <SearchBar
                    value={search}
                    onChange={setSearch}
                />

            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                <DatasetTable
                    datasets={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />

            </div>

        </>
    );

}