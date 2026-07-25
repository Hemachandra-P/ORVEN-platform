import { useEffect, useState } from "react";

import SearchBar from "../../components/organizations/SearchBar";
import ProjectTable from "../../components/projects/ProjectTable";
import ProjectModal from "../../components/projects/ProjectModal";
import DeleteProjectDialog from "../../components/projects/DeleteProjectDialog";

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../../services/projectService";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        try {
            setLoading(true);

            const data = await getProjects();

            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedProject(null);
        setOpenModal(true);
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setOpenModal(true);
    };

    const handleSave = async (data) => {
        try {
            setSaving(true);

            if (selectedProject) {
                await updateProject(selectedProject.id, data);
            } else {
                await createProject(data);
            }

            setOpenModal(false);
            setSelectedProject(null);

            await loadProjects();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (project) => {
        setSelectedProject(project);
        setDeleteDialog(true);
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(true);

            await deleteProject(id);

            setDeleteDialog(false);
            setSelectedProject(null);

            await loadProjects();
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-lg font-semibold">
                Loading Projects...
            </div>
        );
    }

    return (
        <>
            <ProjectModal
                isOpen={openModal}
                project={selectedProject}
                loading={saving}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedProject(null);
                }}
                onSave={handleSave}
            />

            <DeleteProjectDialog
                isOpen={deleteDialog}
                project={selectedProject}
                loading={deleting}
                onClose={() => {
                    setDeleteDialog(false);
                    setSelectedProject(null);
                }}
                onDelete={handleDelete}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage all AI projects.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                    + Create Project
                </button>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                />
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <ProjectTable
                    projects={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </div>
        </>
    );
}