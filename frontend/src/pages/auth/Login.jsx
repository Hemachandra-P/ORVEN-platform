import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {

    const navigate = useNavigate();

    const { signIn } = useAuth();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setLoading(true);

            await signIn(username, password);

            navigate("/");

        } catch {

            alert("Invalid credentials");

        }

        setLoading(false);

    }

    return (

        <div className="min-h-screen bg-slate-100 flex justify-center items-center">

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl w-[420px] p-8"
            >

                <h1 className="text-3xl font-bold mb-2">
                    NeuroStack
                </h1>

                <p className="text-slate-500 mb-8">
                    Enterprise AI Platform
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded-xl p-3 mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded-xl p-3 mb-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-xl p-3 hover:bg-blue-700 transition"
                >

                    {loading ? "Signing In..." : "Login"}

                </button>

            </form>

        </div>

    );

}