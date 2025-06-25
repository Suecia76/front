import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function PrivateRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Cargando autenticación...</p>;

    // 👇 Asegúrate que user esté bien formado
    if (!user || !user.id || !user.email) {
        console.warn("PrivateRoute → usuario inválido. Redirigiendo al login");
        return <Navigate to="/users/login" replace />;
    }

    return children;
}
