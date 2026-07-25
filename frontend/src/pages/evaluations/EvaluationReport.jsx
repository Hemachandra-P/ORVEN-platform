import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    FileSpreadsheet,
    Copy,
    CheckCircle,
    XCircle,
    Clock,
    Coins,
} from "lucide-react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import {
    getEvaluation,
    getMetrics,
    getReport,
    getInsights,
    exportPdf,
    exportCsv,
} from "../../services/evaluationReportService";

const PIE_COLORS = ["#22c55e", "#ef4444"];

export default function EvaluationReport() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [evaluation, setEvaluation] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [report, setReport] = useState(null);
    const [insights, setInsights] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [
                    evaluationData,
                    metricsData,
                    reportData,
                    insightsData,
                ] = await Promise.all([
                    getEvaluation(id),
                    getMetrics(id),
                    getReport(id),
                    getInsights(id),
                ]);

                setEvaluation(evaluationData);
                setMetrics(metricsData);
                setReport(reportData);
                setInsights(insightsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    const downloadPdf = async () => {
        try {
            const blob = await exportPdf(id);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;
            a.download = `evaluation-${id}.pdf`;

            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadCsv = async () => {
        try {
            const blob = await exportCsv(id);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;
            a.download = `evaluation-${id}.csv`;

            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text ?? "");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 p-8 animate-pulse">
                <div className="h-12 w-80 bg-slate-300 rounded mb-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-36 rounded-2xl bg-white"></div>
                    ))}
                </div>

                <div className="h-96 rounded-2xl bg-white"></div>
            </div>
        );
    }
    const pieData = [
        {
            name: "Passed",
            value: metrics?.passed_prompts ?? 0,
        },
        {
            name: "Failed",
            value: metrics?.failed_prompts ?? 0,
        },
    ];

    const scoreData =
        report?.results?.map((item, index) => ({
            prompt: `P${index + 1}`,
            score: Number((item.score * 100).toFixed(0)),
        })) ?? [];
    const tokenData =
        report?.results?.map((item, index) => ({
            prompt: `P${index + 1}`,
            tokens: item.total_tokens ?? 0,
        })) ?? [];
    const latencyData =
        report?.results?.map((item, index) => ({
            prompt: `P${index + 1}`,
            latency: Number(item.latency ?? 0),
        })) ?? [];

    return (
        <div className="min-h-screen bg-slate-100 p-8">

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8">

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white rounded-xl shadow p-3 hover:bg-indigo-100 hover:text-indigo-700"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>

                        <h1 className="text-4xl font-bold">
                            Evaluation Report
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Detailed AI Evaluation Summary
                        </p>

                    </div>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={downloadPdf}
                        className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700"
                    >
                        <FileText size={18} />
                        PDF
                    </button>

                    <button
                        onClick={downloadCsv}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700"
                    >
                        <FileSpreadsheet size={18} />
                        CSV
                    </button>

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow p-6 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                <h2 className="text-2xl font-bold">
                    {evaluation?.name}
                </h2>

                <p className="text-green-600 font-semibold mt-2">
                    {evaluation?.status}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">

                    <div>
                        <p className="text-sm text-gray-500">Project</p>
                        <p className="font-semibold">{report?.project_name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Dataset</p>
                        <p className="font-semibold">{report?.dataset_name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Model</p>
                        <p className="font-semibold">{report?.model_name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Started</p>
                        <p>{evaluation?.started_at}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p>{evaluation?.completed_at}</p>
                    </div>

                </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">

                <MetricCard
                    title="Success Rate"
                    value={`${metrics?.success_rate ?? 0}%`}
                />

                <MetricCard
                    title="Passed"
                    value={metrics?.passed_prompts}
                />

                <MetricCard
                    title="Failed"
                    value={metrics?.failed_prompts}
                />

                <MetricCard
                    title="Latency"
                    value={`${Number(metrics?.average_latency ?? 0).toFixed(2)} s`}
                />

                <MetricCard
                    title="Tokens"
                    value={metrics?.total_tokens}
                />

                <MetricCard
                    title="Cost"
                    value={`$${metrics?.total_cost}`}
                />

            </div>

            {/* AI Insights */}

            <div className="bg-white rounded-2xl shadow p-6 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                <h2 className="text-2xl font-bold mb-6">
                    AI Insights
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-green-50 rounded-xl p-5">
                        <h3 className="font-bold text-green-700 mb-3">
                            Strengths
                        </h3>

                        {insights?.strengths?.length ? (
                            insights.strengths.map((item, index) => (
                                <p key={index} className="mb-2">
                                    • {item}
                                </p>
                            ))
                        ) : (
                            <p className="text-slate-500">
                                No strengths available.
                            </p>
                        )}
                    </div>

                    <div className="bg-red-50 rounded-xl p-5">
                        <h3 className="font-bold text-red-700 mb-3">
                            Weaknesses
                        </h3>

                        {insights?.weaknesses?.length ? (
                            insights.weaknesses.map((item, index) => (
                                <p key={index} className="mb-2">
                                    • {item}
                                </p>
                            ))
                        ) : (
                            <p className="text-slate-500">
                                No weaknesses available.
                            </p>
                        )}
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-5">
                        <h3 className="font-bold text-indigo-700 mb-3">
                            Recommendations
                        </h3>

                        {insights?.recommendations?.length ? (
                            insights.recommendations.map((item, index) => (
                                <p key={index} className="mb-2">
                                    • {item}
                                </p>
                            ))
                        ) : (
                            <p className="text-slate-500">
                                No recommendations available.
                            </p>
                        )}
                    </div>

                </div>

            </div>
            <div className="bg-white rounded-2xl shadow p-6 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h2 className="text-2xl font-bold mb-6">
                    Evaluation Analytics
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={125}
                                    paddingAngle={3}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                            <p className="text-sm text-green-700 font-medium">
                                Passed Prompts
                            </p>
                            <p className="text-3xl font-bold text-green-600">
                                {metrics?.passed_prompts ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                            <p className="text-sm text-red-700 font-medium">
                                Failed Prompts
                            </p>
                            <p className="text-3xl font-bold text-red-600">
                                {metrics?.failed_prompts ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
                            <p className="text-sm text-indigo-700 font-medium">
                                Success Rate
                            </p>
                            <p className="text-3xl font-bold text-indigo-600">
                                {metrics?.success_rate ?? 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                <h2 className="text-2xl font-bold mb-6">
                    Prompt Score Distribution
                </h2>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="prompt" />

                            <YAxis domain={[0, 100]} />

                            <Tooltip />

                            <Bar
                                dataKey="score"
                                radius={[8, 8, 0, 0]}
                                fill="#4f46e5"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
            <div className="bg-white rounded-2xl shadow p-6 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                <h2 className="text-2xl font-bold mb-6">
                    Token Usage by Prompt
                </h2>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tokenData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="prompt" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="tokens"
                                fill="#10b981"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
            <div className="bg-white rounded-2xl shadow p-6 mb-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                <h2 className="text-2xl font-bold mb-6">
                    Latency by Prompt
                </h2>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={latencyData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="prompt" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="latency"
                                fill="#f59e0b"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

            <div className="bg-white rounded-2xl shadow">

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 border-b">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Prompt Results
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Click any prompt to inspect its detailed evaluation.
                        </p>
                    </div>

                    <div className="bg-indigo-50 text-indigo-700 px-5 py-2 rounded-xl font-semibold">
                        Total Prompts : {report?.results?.length ?? 0}
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">

                        <thead className="sticky top-0 bg-slate-50 z-10">

                            <tr>

                                <th className="p-4 text-left w-20">
                                    #
                                </th>

                                <th className="p-4 text-left">
                                    Prompt
                                </th>

                                <th className="p-4 text-left">
                                    Score
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>

                                <th className="p-4 text-left">
                                    Tokens
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {report?.results?.map((item, index) => (

                                <tr
                                    key={index}
                                    onClick={() => setSelectedPrompt(item)}
                                    className="border-t transition-all duration-200 hover:bg-indigo-50 hover:shadow-sm cursor-pointer"
                                >

                                    <td className="p-4 font-semibold text-slate-500">
                                        {index + 1}
                                    </td>

                                    <td className="p-4">
                                        <div className="max-w-xl truncate font-semibold">
                                            {item.prompt}
                                        </div>
                                    </td>

                                    <td className="p-4">

                                        <div className="font-semibold mb-2">
                                            {(item.score * 100).toFixed(0)}%
                                        </div>

                                        <div className="w-32 bg-slate-200 rounded-full h-2">

                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${item.score * 100}%`,
                                                }}
                                            />

                                        </div>

                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.passed
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.passed ? "Passed" : "Failed"}
                                        </span>

                                    </td>

                                    <td className="p-4">
                                        {item.total_tokens}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>
                </div>

            </div>

            {selectedPrompt && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[85vh] overflow-y-auto">

                        <div className="flex justify-between items-center p-6 border-b">

                            <h2 className="text-2xl font-bold">
                                Prompt Details
                            </h2>

                            <button
                                onClick={() => setSelectedPrompt(null)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:shadow-md"
                                aria-label="Close"
                            >
                                <span className="text-xl font-semibold leading-none">&times;</span>
                            </button>

                        </div>

                        <div className="p-6 space-y-6">

                            <div>

                                <h3 className="font-semibold text-slate-600 mb-2">
                                    Prompt
                                </h3>

                                <div className="bg-slate-100 rounded-xl p-5 whitespace-pre-wrap relative">

                                    <button
                                        onClick={() => copyText(selectedPrompt.prompt)}
                                        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
                                        title="Copy Prompt"
                                    >
                                        <Copy size={16} />
                                    </button>

                                    {selectedPrompt.prompt}

                                </div>

                            </div>

                            <div className="bg-green-50 rounded-xl p-5 whitespace-pre-wrap relative">

                                <button
                                    onClick={() => copyText(selectedPrompt.expected_answer)}
                                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
                                    title="Copy Expected Answer"
                                >
                                    <Copy size={16} />
                                </button>

                                {selectedPrompt.expected_answer}

                            </div>

                            <div className="bg-blue-50 rounded-xl p-5 whitespace-pre-wrap relative">

                                <button
                                    onClick={() => copyText(selectedPrompt.model_response)}
                                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
                                    title="Copy Model Response"
                                >
                                    <Copy size={16} />
                                </button>

                                {selectedPrompt.model_response}

                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                                <MetricCard
                                    title="Score"
                                    value={`${(selectedPrompt.score * 100).toFixed(0)}%`}
                                />

                                <MetricCard
                                    title="Tokens"
                                    value={selectedPrompt.total_tokens}
                                />

                                <MetricCard
                                    title="Status"
                                    value={selectedPrompt.passed ? "Passed" : "Failed"}
                                />
                                <MetricCard
                                    title="Latency"
                                    value={`${selectedPrompt.latency ?? 0}s`}
                                />

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

function MetricCard({ title, value }) {
    return (
        <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <p className="text-sm uppercase tracking-wider text-slate-500 font-semibold">
                {title}
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-3 break-words">
                {value}
            </h2>
        </div>
    );
}