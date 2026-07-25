import { useEffect, useState } from "react";

import organizationService from "../../services/organizationService";

import OrganizationTable from "../../components/organizations/OrganizationTable";
import SearchBar from "../../components/organizations/SearchBar";
import OrganizationModal from "../../components/organizations/OrganizationModal";
import DeleteOrganizationDialog from "../../components/organizations/DeleteOrganizationDialog";

export default function Organizations() {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadOrganizations();
    }, []);

    const loadOrganizations = async () => {
        try {
            setLoading(true);

            const data = await organizationService.getOrganizations();

            setOrganizations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = organizations.filter((org) =>
        org.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedOrganization(null);
        setOpenModal(true);
    };

    const handleEdit = (organization) => {
        setSelectedOrganization(organization);
        setOpenModal(true);
    };

    const handleSave = async (data) => {
        try {
            setSaving(true);

            if (selectedOrganization) {
                await organizationService.updateOrganization(
                    selectedOrganization.id,
                    data
                );
            } else {
                await organizationService.createOrganization(data);
            }

            setOpenModal(false);
            setSelectedOrganization(null);

            await loadOrganizations();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (organization) => {
        setSelectedOrganization(organization);
        setDeleteDialog(true);
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(true);

            await organizationService.deleteOrganization(id);

            setDeleteDialog(false);
            setSelectedOrganization(null);

            await loadOrganizations();
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-lg font-semibold">
                Loading Organizations...
            </div>
        );
    }

    return (
        <>
            <OrganizationModal
                isOpen={openModal}
                organization={selectedOrganization}
                loading={saving}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedOrganization(null);
                }}
                onSave={handleSave}
            />

            <DeleteOrganizationDialog
                isOpen={deleteDialog}
                organization={selectedOrganization}
                loading={deleting}
                onClose={() => {
                    setDeleteDialog(false);
                    setSelectedOrganization(null);
                }}
                onDelete={handleDelete}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Organizations
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage all organizations.
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                    + Create Organization
                </button>
            </div>

            <div className="mb-6">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                />
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <OrganizationTable
                    organizations={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </div>
        </>
    );
}