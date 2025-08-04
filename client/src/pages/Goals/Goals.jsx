import { GoalsCard } from "../../components/Goals/GoalsCard";
import { StatusBar } from "../../components/StatusBar";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

const Goals = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      setLoading(true);

      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.commetas/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setGoals(response.data);
        console.log("Metas recibidas del backend:", response.data);
      } catch (error) {
        console.error("Error al obtener las metas:", error.response?.data);
        setError("Error al cargar las metas.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  if (loading) return <p>Cargando metas...</p>;

  /* if (error) {
  return (
    <div className="error-container">
      <p className="error-message">{error}</p>
    </div>
  );
} */
  return (
    <div className="goals">
      <StatusBar label="Mis metas" />

      {goals.length > 0 ? (
        <div className="goals-list">
          {goals.map((goal) => (
            <GoalsCard
              key={goal._id}
              title={goal.nombre}
              percentage={goal.porcentaje}
              amount={goal.objetivo}
              id={goal._id}
              currency={goal.moneda_extranjera?.nombre || null}
              sign={goal.moneda_extranjera?.simbolo || "$"}
            />
          ))}
        </div>
      ) : (
        <div className="no-goals-message">
          <p>No tienes metas registradas aún.</p>
        </div>
      )}

      <button
        className="btn btn--filled-blue"
        onClick={() => (window.location.href = "/goals/add")}
      >
        Crear nueva meta
      </button>
    </div>
  );
};

export { Goals };
