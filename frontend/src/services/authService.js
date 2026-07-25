import api from "./api";

export async function login(username, password) {
    const form = new URLSearchParams();

    form.append("username", username);
    form.append("password", password);
    form.append("grant_type", "password");

    const { data } = await api.post("/auth/login", form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return data;
}

export async function getCurrentUser() {
    const { data } = await api.get("/users/me");
    return data;
}