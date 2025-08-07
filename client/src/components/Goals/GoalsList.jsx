import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";

const GoalsList = () => {
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
          `${import.meta.env.VITE_BACKEND_URL}/metas/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setGoals(response.data);
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
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="goals-list">
      <h2>Mis Metas</h2>
      {goals.length > 0 ? (
        <ul>
          {goals.map((goal) => (
            <li key={goal._id} className="goal-item">
              <div className="goal-header">
                <strong>{goal.nombre}</strong>
                <p>{goal.descripcion}</p>
              </div>
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${(goal.progreso / goal.objetivo) * 100}%`,
                    }}
                  ></div>
                </div>
                <p>
                  Progreso: ${goal.progreso} / ${goal.objetivo}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes metas registradas.</p>
      )}
    </div>
  );
};

export { GoalsList };
