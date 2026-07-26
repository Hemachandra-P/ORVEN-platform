import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import backgroundImage from "../../assets/background.png";

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

        <div
            className="min-h-screen bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "100%",
            }}
        >

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/35"></div>

            {/* Login Container */}
            <div className="relative min-h-screen flex justify-end items-center px-20">

                <form
                    onSubmit={handleSubmit}
                    className="w-[560px]
                    p-12
rounded-[32px]
border border-white/20
bg-white/10
backdrop-blur-2xl
shadow-[0_8px_32px_rgba(0,0,0,0.35)]
"
                >

                    <h1 className="text-5xl font-bold mb-3 text-white tracking-wide">
                        ORVEN
                    </h1>

                    <p className="text-slate-500 text-lg mb-10">
                        Enterprise AI Platform
                    </p>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-xl p-4 mb-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-xl p-4 mb-8 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded-xl p-4 text-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >

                        {loading ? "Signing In..." : "Login"}

                    </button>

                </form>

            </div>

        </div>

    );

}
