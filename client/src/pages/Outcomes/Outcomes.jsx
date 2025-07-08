import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { OutcomesCard } from "../../components/Outcomes/OutcomesCard";
import { Link } from "react-router-dom";
const Outcomes = () => {
  const { user } = useContext(AuthContext);
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `https://back-1-1j7o.onrender.com/gastos/usuario/${user.id}`
        );
        setGastos(response.data);
      } catch (error) {
        console.error("Error al obtener los gastos:", error.response?.data);
      }
    };

    fetchGastos();
  }, [user]);

  return (
    <>
      <div className="outcomes">
        <StatusBar label="Mis gastos" />
        {gastos.length > 0 ? (
          gastos.map((gasto) => (
            <OutcomesCard
              key={gasto._id}
              amount={gasto.cantidad}
              title={gasto.nombre}
              categoria_fk={gasto.categoria_fk}
              state={gasto.estado}
              _id={gasto._id}
            />
          ))
        ) : (
          <p>No tienes gastos registrados.</p>
        )}

        {/* <OutcomesCard
          title="Gasto de prueba"
          icon="/assets/icons/balance.svg"
          amount={1256658}
          category="Prueba"
          state="Prueba"
          stateClassName="pending"
          date={"12/24/1992"}
        /> */}

        <div className="outcomes__actions">
          <Link to="/outcome/add" className="btn btn--filled-blue">
            Añadir nuevo gasto
          </Link>
        </div>
      </div>
    </>
  );
};

export { Outcomes };
