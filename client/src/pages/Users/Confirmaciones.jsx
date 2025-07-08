import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { ConfirmationCard } from "../../components/ConfirmationCard";
import { Tab } from "../../components/Buttons/Tab";

const Confirmaciones = () => {
  const { user } = useContext(AuthContext);
  const [pendientes, setPendientes] = useState({
    ingresosPendientes: [],
    gastosPendientes: [],
  });
  const [selectedTab, setSelectedTab] = useState("gastos");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `http://localhost:3000/usuarios/pendientes/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendientes(res.data);
      } catch (err) {
        console.error("Error al obtener pendientes:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.id) fetchPendientes();
  }, [user]);

  const confirmar = async (tipo, id) => {
    try {
      const token = Cookies.get("token");
      const url =
        tipo === "ingreso"
          ? `http://localhost:3000/ingresos/${id}/confirmar`
          : `http://localhost:3000/gastos/${id}/confirmar`;
      await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendientes((prev) => ({
        ...prev,
        [`${tipo}sPendientes`]: prev[`${tipo}sPendientes`].filter(
          (item) => item._id !== id
        ),
      }));
    } catch (err) {
      console.error("Error al confirmar:", err);
    }
  };

  // if (loading) return <p>Cargando...</p>;

  const tabs = [
    {
      label: "Gastos",
      value: "gastos",
    },

    {
      label: "Ingresos",
      value: "ingresos",
    },
  ];

  function confirmTransaction() {
    console.log("confirming");
  }

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab) => (
          <Tab
            label={tab.label}
            key={tab.value}
            isSelected={selectedTab === tab.value}
            onSelect={() => setSelectedTab(tab.value)}
          />
        ))}
      </div>

      {selectedTab === "ingresos" && (
        <div>
          <h2>Ingresos a confirmar</h2>

          {pendientes.ingresosPendientes.length === 0 ? (
            <p>No hay ingresos pendientes.</p>
          ) : (
            pendientes.ingresosPendientes.map((ingreso) => (
              <div
                key={ingreso._id}
                style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}
              >
                <strong>{ingreso.nombre}</strong> – ${ingreso.cantidad}
                <button
                  onClick={() => confirmar("ingreso", ingreso._id)}
                  style={{ marginLeft: 10 }}
                >
                  Confirmar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedTab === "gastos" && (
        <div>
          <h2>Gastos a confirmar</h2>

          {pendientes.gastosPendientes.length === 0 ? (
            <p>No hay gastos pendientes.</p>
          ) : (
            pendientes.gastosPendientes.map((gasto) => (
              <div
                key={gasto._id}
                style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}
              >
                <strong>{gasto.nombre}</strong> – ${gasto.cantidad}
                <button
                  onClick={() => confirmar("gasto", gasto._id)}
                  style={{ marginLeft: 10 }}
                >
                  Confirmar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* <ConfirmationCard
        title="Trial"
        amount={352}
        confirmFunction={confirmTransaction}
      /> */}
    </div>
  );
};

export { Confirmaciones };
