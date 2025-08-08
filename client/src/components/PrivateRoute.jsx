import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function PrivateRoute({ children }) {
  const location = useLocation();

  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);

    return children;
  } catch (error) {
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }
}
