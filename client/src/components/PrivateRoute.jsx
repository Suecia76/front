import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function PrivateRoute({ children }) {
  const location = useLocation();

  const token = Cookies.get("token");

  if (!token) {
    // No hay token → redirige a login
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Aquí podés agregar más validaciones, por ejemplo:
    // - chequear expiración (decoded.exp)
    // - otros campos del payload

    // Si todo OK, muestra children
    return children;
  } catch (error) {
    // Token inválido o mal formado
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }
}
