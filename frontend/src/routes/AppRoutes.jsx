import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";

import Organizations from "../pages/organizations/Organizations";
import Projects from "../pages/projects/Projects";
import Models from "../pages/models/Models";
import Datasets from "../pages/datasets/Datasets";
import Documents from "../pages/documents/Documents";
import RagChat from "../pages/chat/RagChat";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";
import Evaluations from "../pages/evaluations/Evaluations";
import EvaluationReport from "../pages/evaluations/EvaluationReport";

import MainLayout from "../components/layout/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>

                            <MainLayout />

                        </ProtectedRoute>
                    }
                >

                    <Route index element={<Dashboard />} />

                    <Route path="organizations" element={<Organizations />} />

                    <Route path="projects" element={<Projects />} />

                    <Route path="models" element={<Models />} />

                    <Route path="datasets" element={<Datasets />} />

                    <Route path="documents" element={<Documents />} />

                    <Route path="/evaluations" element={<Evaluations />} />

                    <Route path="chat" element={<RagChat />} />

                    <Route path="analytics" element={<Analytics />} />

                    <Route path="settings" element={<Settings />} />

                    <Route path="/evaluations/:id/report" element={<EvaluationReport />} />


                </Route>

            </Routes>

        </BrowserRouter>

    );

}