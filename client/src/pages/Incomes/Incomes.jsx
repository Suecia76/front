import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { IncomesCard } from "../../components/Incomes/IncomesCard";
import { Link } from "react-router-dom";

const Incomes = () => {
  const { user, loading } = useContext(AuthContext);
  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    console.log("Incomes → Estado de user:", user);
  }, [user]);

  useEffect(() => {
    const fetchIngresos = async () => {
      if (loading || !user?.id) return;

      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `http://localhost:3000/ingresos/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setIngresos(response.data);
      } catch (error) {
        console.error("Error al obtener los ingresos:", error.response?.data);
      }
    };

    fetchIngresos();
  }, [user]);

  return (
    <>
      <div>
        <StatusBar label="Mis ingresos" />

        {ingresos.length > 0 ? (
          <ul className="incomes">
            {ingresos.map((ingreso) => (
              <IncomesCard
                key={ingreso._id}
                _id={ingreso._id}
                title={ingreso.nombre}
                amount={ingreso.cantidad}
                categoria_fk={ingreso.categoria_fk}
                state={ingreso.pendienteConfirmacion ? "Pendiente" : "Confirmado"}
                stateClassName={ingreso.pendienteConfirmacion ? "Pendiente" : "Confirmado"}
                
              />
            ))}
          </ul>
        ) : (
          <p>No tienes ingresos registrados.</p>
        )}

        {/* <IncomesCard
          title="Ingreso de prueba"
          icon="./src/assets/icons/balance.svg"
          amount={484}
          category="Prueba"
          state="Prueba"
          stateClassName="pending"
          date={"12/24/1992"}
        /> */}
      </div>

      <div className="incomes__actions">
        <Link to="/income/add" className="btn btn--filled-blue">
          Añadir nuevo ingreso
        </Link>
      </div>
    </>
  );
};

export { Incomes };
