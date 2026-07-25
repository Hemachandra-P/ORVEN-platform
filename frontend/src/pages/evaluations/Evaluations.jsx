import { useEffect, useState } from "react";

import SearchBar from "../../components/organizations/SearchBar";
import EvaluationTable from "../../components/evaluations/EvaluationTable";
import EvaluationModal from "../../components/evaluations/EvaluationModal";
import DeleteEvaluationDialog from "../../components/evaluations/DeleteEvaluationDialog";

import {
    getEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    runEvaluation,
} from "../../services/evaluationService";

import { getProjects } from "../../services/projectService";
import { getDatasets } from "../../services/datasetService";
import { getModels } from "../../services/modelService";

export default function Evaluations() {

    const [evaluations, setEvaluations] = useState([]);
    const [projects, setProjects] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [models, setModels] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        await Promise.all([
            loadEvaluations(),
            loadProjects(),
            loadDatasets(),
            loadModels(),
        ]);
    }

    async function loadEvaluations() {
        try {
            setLoading(true);

            const response = await getEvaluations();
            setEvaluations(response.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function loadProjects() {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function loadDatasets() {
        try {
            const data = await getDatasets();
            setDatasets(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function loadModels() {
        try {
            const data = await getModels();
            setModels(data);
        } catch (err) {
            console.error(err);
        }
    }

    const filtered = evaluations.filter((evaluation) =>
        evaluation.name.toLowerCase().includes(search.toLowerCase()) ||
        evaluation.status.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedEvaluation(null);
        setOpenModal(true);
    };

    const handleEdit = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setOpenModal(true);
    };

    const handleSave = async (data) => {
        try {

            setSaving(true);

            if (selectedEvaluation) {
                await updateEvaluation(selectedEvaluation.id, data);
            } else {
                await createEvaluation(data);
            }

            setOpenModal(false);
            setSelectedEvaluation(null);

            await loadEvaluations();

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setDeleteDialog(true);
    };

    const handleDelete = async (id) => {
        try {

            setDeleting(true);

            await deleteEvaluation(id);

            setDeleteDialog(false);
            setSelectedEvaluation(null);

            await loadEvaluations();

        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const handleRun = async (evaluation) => {

        try {

            await runEvaluation(evaluation.id);

            await loadEvaluations();

        } catch (err) {

            console.error(err);

            alert("Failed to run evaluation.");

        }

    };

    if (loading) {
        return (
            <div className="text-center py-10 text-lg font-semibold">
                Loading Evaluations...
            </div>
        );
    }

    return (
        <>

            <EvaluationModal
                isOpen={openModal}
                evaluation={selectedEvaluation}
                loading={saving}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedEvaluation(null);
                }}
                onSave={handleSave}
            />

            <DeleteEvaluationDialog
                isOpen={deleteDialog}
                evaluation={selectedEvaluation}
                loading={deleting}
                onClose={() => {
                    setDeleteDialog(false);
                    setSelectedEvaluation(null);
                }}
                onDelete={handleDelete}
            />

            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-3xl font-bold">
                        Evaluations
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage AI evaluations.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                    + Create Evaluation
                </button>

            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                />
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                <EvaluationTable
                    evaluations={filtered}
                    projects={projects}
                    datasets={datasets}
                    models={models}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onRun={handleRun}
                />

            </div>

        </>
    );
}