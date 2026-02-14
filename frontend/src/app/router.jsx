import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";
import useAuth from "../hooks/useAuth";

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? <Landing /> : <Navigate to="/login" replace />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
