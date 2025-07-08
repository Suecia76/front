import { GoalsCard } from "../../components/Goals/GoalsCard";
import {StatusBar} from "../../components/StatusBar"
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Cookies from 'js-cookie'

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
          `http://localhost:3000/metas/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setGoals(response.data);
        console.log('goals', goals)
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
      <StatusBar label="Mis metas"/>

      {goals.length > 0 ? (
        <>
          {goals.map((goal) => (
            <GoalsCard key ={goal._id} title={goal.nombre} progress={goal.progreso} amount={goal.objetivo} id={goal._id}/>
          ))}
        </>
      ) : (
        <p>No tienes metas registradas.</p>
      )}

    </div>
  );
};


export {Goals}
