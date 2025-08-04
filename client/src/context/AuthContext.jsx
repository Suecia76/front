import { useState, useEffect, createContext } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token") || null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("AuthContext → Token decodificado:", decoded);

        if (decoded && decoded.id && decoded.email) {
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name || "",
          });
        } else {
          setUser(null);
          Cookies.remove("token");
          navigate("/users/login");
        }
      } catch (err) {
        console.error("AuthContext → error al decodificar token", err);
        setUser(null);
        Cookies.remove("token");
        navigate("/users/login");
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const logoutUser = () => {
    setUser(null);
    Cookies.remove("token");
    navigate("/users/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
