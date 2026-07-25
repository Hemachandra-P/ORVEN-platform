import { createContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadUser() {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const me = await authService.getCurrentUser();

                setUser(me);

            } catch {

                localStorage.removeItem("token");

            }

            setLoading(false);

        }

        loadUser();

    }, []);

    async function signIn(username, password) {

        const data = await authService.login(username, password);

        localStorage.setItem("token", data.access_token);

        const me = await authService.getCurrentUser();

        setUser(me);

    }

    function logout() {

        localStorage.removeItem("token");

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}