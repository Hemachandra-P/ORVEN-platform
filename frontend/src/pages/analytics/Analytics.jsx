import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const PROVIDER_COLORS = [
    { hex: "#6366F1", bar: "bg-indigo-500", chip: "bg-indigo-100 text-indigo-700" },
    { hex: "#10B981", bar: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-700" },
    { hex: "#FBBF24", bar: "bg-amber-400", chip: "bg-amber-100 text-amber-700" },
    { hex: "#F43F5E", bar: "bg-rose-500", chip: "bg-rose-100 text-rose-700" },
    { hex: "#0EA5E9", bar: "bg-sky-500", chip: "bg-sky-100 text-sky-700" },
    { hex: "#8B5CF6", bar: "bg-violet-500", chip: "bg-violet-100 text-violet-700" },
];

const getProviderColor = (index) => PROVIDER_COLORS[index % PROVIDER_COLORS.length];

const STATUS_META = [
    { key: "completed", label: "Completed", hex: "#10B981", dot: "bg-emerald-500" },
    { key: "failed", label: "Failed", hex: "#F43F5E", dot: "bg-rose-500" },
    { key: "running", label: "Running", hex: "#0EA5E9", dot: "bg-sky-500" },
    { key: "pending", label: "Pending", hex: "#FBBF24", dot: "bg-amber-400" },
];

// ---------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------

function SkeletonBlock({ className }) {
    return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

function EmptyNote({ text }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
            {text}
        </div>
    );
}

function TelemetryStat({ label, value, dot }) {
    return (
        <div>
            <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {label}
                </span>
            </div>
            <p className="mt-1.5 font-mono text-xl font-bold text-white">{value}</p>
        </div>
    );
}

function PlatformChip({ label, value, icon }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200">
            <span className="text-lg">{icon}</span>
            <div>
                <p className="font-mono text-lg font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
            </div>
        </div>
    );
}

function RankBadge({ rank }) {
    const gradients = {
        1: "bg-gradient-to-br from-amber-300 to-amber-500",
        2: "bg-gradient-to-br from-slate-300 to-slate-400",
        3: "bg-gradient-to-br from-orange-300 to-orange-500",
    };
    const medal = { 1: "🥇", 2: "🥈", 3: "🥉" };

    if (rank <= 3) {
        return (
            <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm ${gradients[rank]}`}
            >
                {medal[rank]}
            </span>
        );
    }

    return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-semibold text-slate-500">
            {rank}
        </span>
    );
}

// Single-value radial gauge (used for overall success rate)
function RingGauge({ value, size = 128, strokeWidth = 10, color = "#818CF8" }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const safeValue = Math.max(0, Math.min(100, value || 0));
    const offset = circumference * (1 - (mounted ? safeValue : 0) / 100);

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 900ms ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold text-white">
                    {safeValue.toFixed(1)}%
                </span>
                <span className="mt-1 text-xs uppercase tracking-widest text-slate-400">
                    Success
                </span>
            </div>
        </div>
    );
}

// Multi-segment radial breakdown (used for evaluation status mix)
function SegmentedRing({ segments, size = 128, strokeWidth = 14 }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((sum, s) => sum + s.value, 0);

    let cumulative = 0;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth={strokeWidth}
                />
                {total > 0 &&
                    segments.map((seg) => {
                        if (seg.value <= 0) return null;

                        const fraction = seg.value / total;
                        const length = mounted ? circumference * fraction : 0;
                        const dashArray = `${length} ${circumference - length}`;
                        const dashOffset = -cumulative * circumference;
                        cumulative += fraction;

                        return (
                            <circle
                                key={seg.label}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                style={{ transition: "stroke-dasharray 900ms ease-out" }}
                            />
                        );
                    })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-bold text-slate-800">{total}</span>
                <span className="mt-1 text-xs uppercase tracking-widest text-slate-400">Total</span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Main page
// ---------------------------------------------------------

export default function Analytics() {
    const [dashboard, setDashboard] = useState(null);
    const [evaluationAnalytics, setEvaluationAnalytics] = useState(null);
    const [providerMetrics, setProviderMetrics] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const authHeaders = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const fetchAll = async () => {
        setLoading(true);
        setError(null);

        try {
            const [dashboardRes, analyticsRes, providersRes, leaderboardRes] =
                await Promise.all([
                    axios.get(`${API_BASE_URL}/metrics/dashboard`, authHeaders()),
                    axios.get(`${API_BASE_URL}/analytics/evaluations`, authHeaders()),
                    axios.get(`${API_BASE_URL}/metrics/providers`, authHeaders()),
                    axios.get(`${API_BASE_URL}/leaderboard/evaluations`, authHeaders()),
                ]);

            setDashboard(dashboardRes.data);
            setEvaluationAnalytics(analyticsRes.data);
            setProviderMetrics(providersRes.data);
            setLeaderboard(leaderboardRes.data.leaderboard || []);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Failed to load analytics:", err);
            setError(
                "Couldn't load analytics data. This usually means your session has expired or your account doesn't have admin access — try logging out and back in."
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Loading state
    // -----------------------------
    if (loading) {
        return (
            <div className="h-[calc(100vh-80px)] overflow-y-auto bg-slate-100 p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <SkeletonBlock className="h-9 w-56" />
                    <SkeletonBlock className="h-56 w-full rounded-3xl" />
                    <div className="flex gap-3">
                        <SkeletonBlock className="h-16 w-40" />
                        <SkeletonBlock className="h-16 w-40" />
                        <SkeletonBlock className="h-16 w-40" />
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <SkeletonBlock className="h-64 w-full rounded-3xl" />
                        <SkeletonBlock className="h-64 w-full rounded-3xl" />
                    </div>
                    <SkeletonBlock className="h-72 w-full rounded-3xl" />
                    <SkeletonBlock className="h-72 w-full rounded-3xl" />
                </div>
            </div>
        );
    }

    // -----------------------------
    // Error state
    // -----------------------------
    if (error) {
        return (
            <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center gap-3 bg-slate-100 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-2xl">
                    ⚠️
                </div>
                <h2 className="text-lg font-bold text-slate-800">Analytics unavailable</h2>
                <p className="max-w-md text-sm text-slate-500">{error}</p>
                <button
                    onClick={fetchAll}
                    className="mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                >
                    Try again
                </button>
            </div>
        );
    }

    const providerEntries = Object.entries(dashboard?.providers || {});
    const maxProviderCount = Math.max(1, ...providerEntries.map(([, count]) => count));

    const statusSegments = STATUS_META.map((s) => ({
        ...s,
        value: dashboard?.[`${s.key}_evaluations`] ?? 0,
        color: s.hex,
    }));

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto bg-slate-100 p-6">
            <style>{`
                @keyframes ns-fade-up {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .ns-fade-up { animation: ns-fade-up 0.45s ease-out both; }
                @media (prefers-reduced-motion: reduce) {
                    .ns-fade-up { animation: none; }
                }
            `}</style>

            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Platform-wide evaluation performance and cost overview.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {lastUpdated && (
                            <span className="text-xs text-slate-400">
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={fetchAll}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                {/* Hero: system health telemetry panel */}
                <div className="ns-fade-up relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-xl ring-1 ring-white/10 md:p-10">
                    <div
                        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500 opacity-20 blur-3xl"
                        aria-hidden="true"
                    />

                    <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-8">
                            <RingGauge value={evaluationAnalytics?.average_success_rate ?? 0} />

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
                                    System Health
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-white">
                                    {dashboard?.total_evaluations ?? 0} evaluations tracked
                                </h2>
                                {evaluationAnalytics?.best_provider && (
                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
                                        <span>🏆</span>
                                        <span className="text-slate-300">Top provider:</span>
                                        <span className="font-semibold">
                                            {evaluationAnalytics.best_provider}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-5 md:grid-cols-4">
                            <TelemetryStat
                                label="Evaluations"
                                value={dashboard?.total_evaluations ?? 0}
                                dot="bg-indigo-400"
                            />
                            <TelemetryStat
                                label="Avg Latency"
                                value={`${(dashboard?.average_latency ?? 0).toFixed(2)}s`}
                                dot="bg-sky-400"
                            />
                            <TelemetryStat
                                label="Tokens"
                                value={(dashboard?.total_tokens ?? 0).toLocaleString()}
                                dot="bg-violet-400"
                            />
                            <TelemetryStat
                                label="Cost"
                                value={`$${(dashboard?.total_cost ?? 0).toFixed(3)}`}
                                dot="bg-emerald-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Platform overview chips */}
                <div className="ns-fade-up flex flex-wrap gap-3" style={{ animationDelay: "60ms" }}>
                    <PlatformChip label="Projects" value={dashboard?.total_projects ?? 0} icon="📁" />
                    <PlatformChip label="AI Models" value={dashboard?.total_models ?? 0} icon="🧠" />
                    <PlatformChip label="Datasets" value={dashboard?.total_datasets ?? 0} icon="🗂️" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Evaluation Status */}
                    <div
                        className="ns-fade-up rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                        style={{ animationDelay: "100ms" }}
                    >
                        <h2 className="text-base font-bold text-slate-800">Evaluation Status</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Current run outcomes across the platform.
                        </p>

                        <div className="mt-6 flex items-center gap-8">
                            <SegmentedRing segments={statusSegments} />

                            <div className="flex-1 space-y-3">
                                {statusSegments.map((s) => (
                                    <div key={s.label} className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-slate-600">
                                            <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                                            {s.label}
                                        </span>
                                        <span className="font-mono font-semibold text-slate-800">
                                            {s.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Evaluations by Provider */}
                    <div
                        className="ns-fade-up rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                        style={{ animationDelay: "140ms" }}
                    >
                        <h2 className="text-base font-bold text-slate-800">Evaluations by Provider</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Volume distribution across connected providers.
                        </p>

                        <div className="mt-6 space-y-4">
                            {providerEntries.length === 0 ? (
                                <EmptyNote text="No evaluations recorded yet." />
                            ) : (
                                providerEntries.map(([provider, count], idx) => {
                                    const color = getProviderColor(idx);
                                    const widthPct = Math.round((count / maxProviderCount) * 100);

                                    return (
                                        <div key={provider}>
                                            <div className="mb-1.5 flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 font-medium text-slate-700">
                                                    <span className={`h-2.5 w-2.5 rounded-sm ${color.bar}`} />
                                                    {provider}
                                                </span>
                                                <span className="font-mono text-slate-500">{count}</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full ${color.bar} transition-all duration-700`}
                                                    style={{ width: `${widthPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                </div>

                {/* Provider Performance Comparison */}
                <div
                    className="ns-fade-up rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                    style={{ animationDelay: "180ms" }}
                >
                    <h2 className="text-base font-bold text-slate-800">Provider Performance</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Head-to-head comparison across every connected provider.
                    </p>

                    {providerMetrics.length === 0 ? (
                        <div className="mt-6">
                            <EmptyNote text="No provider metrics yet." />
                        </div>
                    ) : (
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Provider
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Runs
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Success
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Latency
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Tokens
                                        </th>
                                        <th className="pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Cost
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {providerMetrics.map((p, idx) => {
                                        const color = getProviderColor(idx);

                                        return (
                                            <tr
                                                key={p.provider}
                                                className="border-b border-slate-100 transition hover:bg-slate-50 last:border-0"
                                            >
                                                <td className="py-3.5 pr-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${color.chip}`}
                                                    >
                                                        {p.provider}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 pr-4 font-mono text-slate-700">
                                                    {p.total_evaluations}
                                                    {p.failed_evaluations > 0 && (
                                                        <span className="ml-1.5 font-sans text-xs text-rose-500">
                                                            {p.failed_evaluations} failed
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className={`h-full rounded-full ${color.bar}`}
                                                                style={{ width: `${p.average_success_rate}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-mono text-slate-700">
                                                            {p.average_success_rate.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 pr-4 font-mono text-slate-700">
                                                    {p.average_latency.toFixed(2)}s
                                                </td>
                                                <td className="py-3.5 pr-4 font-mono text-slate-700">
                                                    {p.total_tokens.toLocaleString()}
                                                </td>
                                                <td className="py-3.5 font-mono text-slate-700">
                                                    ${p.total_cost.toFixed(3)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Leaderboard */}
                <div
                    className="ns-fade-up rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
                    style={{ animationDelay: "220ms" }}
                >
                    <h2 className="text-base font-bold text-slate-800">Evaluation Leaderboard</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Top-ranked evaluation runs, sorted by overall performance.
                    </p>

                    {leaderboard.length === 0 ? (
                        <div className="mt-6">
                            <EmptyNote text="No evaluations have been run yet. Run one from the Evaluations tab to see it here." />
                        </div>
                    ) : (
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Rank
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Evaluation
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Project
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Model
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Success
                                        </th>
                                        <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Latency
                                        </th>
                                        <th className="pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Cost
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((row) => (
                                        <tr
                                            key={row.evaluation_id}
                                            className={`border-b border-slate-100 transition hover:bg-slate-50 last:border-0 ${
                                                row.rank <= 3 ? "bg-amber-50/40" : ""
                                            }`}
                                        >
                                            <td className="py-3.5 pr-4">
                                                <RankBadge rank={row.rank} />
                                            </td>
                                            <td className="py-3.5 pr-4 font-medium text-slate-800">
                                                {row.evaluation_name}
                                            </td>
                                            <td className="py-3.5 pr-4 text-slate-600">{row.project_name}</td>
                                            <td className="py-3.5 pr-4 text-slate-600">
                                                {row.model_name}
                                                <span className="ml-1 text-xs text-slate-400">
                                                    ({row.provider})
                                                </span>
                                            </td>
                                            <td className="py-3.5 pr-4 font-mono font-medium text-emerald-600">
                                                {row.success_rate.toFixed(1)}%
                                            </td>
                                            <td className="py-3.5 pr-4 font-mono text-slate-600">
                                                {row.average_latency.toFixed(2)}s
                                            </td>
                                            <td className="py-3.5 font-mono text-slate-600">
                                                ${row.total_cost.toFixed(3)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
