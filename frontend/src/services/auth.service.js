import api from "../app/axios";

const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

const login = async (userData) => {
    const response = await api.post("/auth/login", userData);
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

const authService = {
    register,
    login,
    logout
};

export default authService;
