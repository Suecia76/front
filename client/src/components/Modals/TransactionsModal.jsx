import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IncomesCard } from "../Incomes/IncomesCard";
import { OutcomesCard } from "../Outcomes/OutcomesCard";
import { ModalWrapper } from "./ModalWrapper";
import { Tab } from "../Buttons/Tab";

const TransactionsModal = ({ onClose, selectedDate, movements, loading }) => {
  const movimientos = movements[selectedDate] || [];
  const [selectedTab, setSelectedTab] = useState("gastos");

  const tabs = [
    { label: "Gastos", value: "gastos" },
    { label: "Ingresos", value: "ingresos" },
  ];

  // Agrupar ingresos y gastos
  const ingresos = movimientos.filter(
    (mov) => mov.tipoMovimiento === "ingreso"
  );
  const gastos = movimientos.filter((mov) => mov.tipoMovimiento === "gasto");

  useEffect(() => {
    if (gastos.length > 0 && ingresos.length === 0) {
      setSelectedTab("gastos");
    } else if (gastos.length === 0 && ingresos.length > 0) {
      setSelectedTab("ingresos");
    }
  }, [gastos.length, ingresos.length]);

  return (
    <ModalWrapper centered={true} onClose={onClose} loading={loading}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>

        <h2>Movimientos del {selectedDate}</h2>

        <div className="tabs">
          {tabs.map((tab) => (
            <Tab
              label={tab.label}
              key={tab.label}
              isSelected={selectedTab === tab.value}
              onSelect={() => setSelectedTab(tab.value)}
            />
          ))}
        </div>

        <section className="movements">
          {selectedTab === "ingresos" && (
            <>
              {ingresos.length > 0 ? (
                <>
                  {/* Hay ingresos cargados */}
                  {ingresos.map((mov, index) => (
                    <article
                      className={`movements__item ${
                        mov.pendienteConfirmacion
                          ? "movements__item--pending"
                          : "movements__item--fulfilled"
                      }`}
                      key={mov._id || index}
                      style={
                        !mov.pendienteConfirmacion ? { color: "green" } : {}
                      }
                    >
                      <IncomesCard
                        _id={mov._id}
                        amount={mov.cantidad}
                        title={mov.nombre}
                        categoria_fk={mov.categoria_fk}
                        state={
                          mov.pendienteConfirmacion
                            ? "Pendiente de confirmación"
                            : "Recibido"
                        }
                        cuotasTotales={mov.cuotas}
                        cuotasProcesadas={mov.cuotasProcesadas}
                      />
                    </article>
                  ))}
                </>
              ) : (
                <>
                  {/* No hay ingresos cargados */}
                  <p>No tenés ingresos cargados esta fecha</p>

                  <a href="/incomes/add" className="btn btn--filled-blue">
                    Agregar ingreso
                  </a>
                </>
              )}
            </>
          )}
        </section>

        <section className="movements">
          {selectedTab === "gastos" && (
            <>
              {gastos.length > 0 ? (
                <>
                  {/* Hay ingresos cargados */}
                  {gastos.map((mov, index) => (
                    <article
                      className={`movements__item ${
                        mov.pendienteConfirmacion
                          ? "movements__item--pending"
                          : "movements__item--fulfilled"
                      }`}
                      key={mov._id || index}
                      style={
                        !mov.pendienteConfirmacion ? { color: "green" } : {}
                      }
                    >
                      <OutcomesCard
                        _id={mov._id}
                        amount={mov.cantidad}
                        title={mov.nombre}
                        categoria_fk={mov.categoria_fk}
                        state={mov.estado}
                        cuotasTotales={mov.cuotas}
                        cuotasProcesadas={mov.cuotasProcesadas}
                      />
                    </article>
                  ))}
                </>
              ) : (
                <>
                  {/* No hay ingresos cargados */}
                  <p>No tenés gastos cargados esta fecha</p>

                  <a href="/outcome/add" className="btn btn--filled-blue">
                    Agregar gasto
                  </a>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </ModalWrapper>
  );
};

TransactionsModal.propTypes = {
  onClose: PropTypes.func,
  selectedDate: PropTypes.any,
  movements: PropTypes.objectOf(PropTypes.array).isRequired,
  loading: PropTypes.bool,
};

export default TransactionsModal;
