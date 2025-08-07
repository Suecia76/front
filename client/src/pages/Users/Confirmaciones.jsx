import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { Tab } from "../../components/Buttons/Tab";
import { ModalWrapper, Dialog, ConfirmTransactionCard } from "../../components";

const Confirmaciones = () => {
  const { user } = useContext(AuthContext);
  const [pendientes, setPendientes] = useState({
    ingresosPendientes: [],
    gastosPendientes: [],
  });
  const [selectedTab, setSelectedTab] = useState("gastos");
  // const [confirmationModalOpened, setConfirmationModalOpened] =useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/usuarios/pendientes/${user.id}`,
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

  console.log(pendientes);
  const handleConfirm = async (type, id) => {
    try {
      const token = Cookies.get("token");
      let url;

      if (type === "ingreso" && id) {
        url = `${import.meta.env.VITE_BACKEND_URL}/ingresos/${id}/confirmar`;
      } else if (type === "gasto" && id) {
        url = `${import.meta.env.VITE_BACKEND_URL}/gastos/${id}/confirmar`;
      }

      await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendientes((prev) => ({
        ...prev,
        [`${type}sPendientes`]: prev[`${type}sPendientes`].filter(
          (item) => item._id !== id
        ),
      }));

      setSelectedTransaction(null);
      // setConfirmationModalOpened(false);
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
        <>
          <div>
            <h2>Ingresos a confirmar</h2>
            <div className="autolayout-1">
              {pendientes.ingresosPendientes.length === 0 ? (
                <p>No hay ingresos pendientes.</p>
              ) : (
                pendientes.ingresosPendientes.map((ingreso) => (
                  <ConfirmTransactionCard
                    _id={ingreso._id}
                    key={ingreso._id}
                    title={ingreso.nombre}
                    amount={ingreso.cantidad}
                    type="income"
                    totalInstallments={ingreso.cuotas}
                    payedInstallments={ingreso.cuotasProcesadas}
                    onConfirm={() =>
                      setSelectedTransaction({
                        type: "ingreso",
                        id: ingreso._id,
                      })
                    }
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}

      {selectedTab === "gastos" && (
        <>
          <div>
            <h2>Gastos a confirmar</h2>

            <div className="autolayout-1">
              {pendientes.gastosPendientes.length === 0 ? (
                <p>No hay gastos pendientes.</p>
              ) : (
                pendientes.gastosPendientes.map((gasto) => (
                  <ConfirmTransactionCard
                    _id={gasto._id}
                    key={gasto._id}
                    title={gasto.nombre}
                    amount={gasto.cantidad}
                    type="outcome"
                    totalInstallments={gasto.cuotas}
                    payedInstallments={gasto.cuotasProcesadas}
                    onConfirm={() => {
                      setSelectedTransaction({
                        type: "gasto",
                        id: gasto._id,
                      });
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}

      {selectedTransaction && (
        <ModalWrapper small={true} onClose={() => setSelectedTransaction(null)}>
          <Dialog
            title={`Confirmando ${
              selectedTransaction.type === "ingreso" ? "Ingreso" : "Gasto"
            }`}
            text={
              selectedTransaction.type === "ingreso"
                ? "Si lo confirmas, sumaremos el dinero a tu balance y marcaremos el ingreso como cobrado"
                : "Si lo confirmas, restaremos el dinero de tu balance y marcaremos el gasto como abonado"
            }
            option1="Confirmar"
            option2="Cancelar"
            onClick1={() =>
              handleConfirm(selectedTransaction.type, selectedTransaction.id)
            }
            onClick2={() => {
              setSelectedTransaction(null);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

export { Confirmaciones };
