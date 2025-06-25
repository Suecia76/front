import React from "react";
import PropTypes from "prop-types";
import { IncomesCard } from "../Incomes/IncomesCard";
import { OutcomesCard } from "../Outcomes/OutcomesCard";
import { ModalWrapper } from "./ModalWrapper";

const TransactionsModal = ({ onClose, selectedDate, movements }) => {
  const movimientos = movements[selectedDate] || [];

  // Agrupar ingresos y gastos
  const ingresos = movimientos.filter(
    (mov) => mov.tipoMovimiento === "ingreso"
  );
  const gastos = movimientos.filter((mov) => mov.tipoMovimiento === "gasto");

  return (
    <ModalWrapper centered={true} onClose={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>

        <h2>Movimientos del {selectedDate}</h2>

        <section className="movements">
          {ingresos.length > 0 && <h3>Ingresos</h3>}
          {ingresos.map((mov, index) => (
            <article
              className={`movements__item ${
                mov.pendienteConfirmacion
                  ? "movements__item--pending"
                  : "movements__item--fulfilled"
              }`}
              key={mov._id || index}
              style={!mov.pendienteConfirmacion ? { color: "green" } : {}}
            >
              <IncomesCard
                _id= {mov._id}
                amount={mov.cantidad}
                title={mov.nombre}
                categoria_fk={mov.categoria_fk}
                state={
                  mov.pendienteConfirmacion
                    ? "Pendiente de confirmación"
                    : "Recibido"
                }
              />
              {mov.cuota && <span> (Cuota {mov.cuota})</span>}
            </article>
          ))}
        </section>

        <section className="movements">
          {gastos.length > 0 && <h3>Gastos</h3>}
          {gastos.map((mov, index) => (
            <article
              className={`movements__item ${
                mov.estado === "pagado"
                  ? "movements__item--fulfilled"
                  : "movements__item--pending"
              }`}
              key={mov._id || index}
              style={{ color: "green" }}
            >
              <OutcomesCard
                _id = {mov._id}
                amount={mov.cantidad}
                title={mov.nombre}
                categoria_fk={mov.categoria_fk}
                state={mov.estado}
              />
              {mov.cuota && <span> (Cuota {mov.cuota})</span>}
            </article>
          ))}
        </section>
      </div>
    </ModalWrapper>
  );
};

TransactionsModal.propTypes = {
  onClose: PropTypes.func,
  selectedDate: PropTypes.any,
  movements: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default TransactionsModal;
