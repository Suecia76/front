import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Tab } from "../../components/Buttons/Tab";
import { StatusBar } from "../../components/StatusBar";
import { addMonths, subMonths, format } from "date-fns";
import { es } from "date-fns/locale"; // para mostrarlo en español
import TransactionsModal from "../../components/Modals/TransactionsModal";

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [movimientos, setMovimientos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleDate, setVisibleDate] = useState(new Date());
  const [movimientosPorTipo, setMovimientosPorTipo] = useState([]);

  useEffect(() => {
    const fetchMovimientos = async () => {
      const token = Cookies.get("token");
      const res = await axios.get(
        `https://app-nttd.onrender.com/usuarios/calendario/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMovimientos(res.data);
    };
    if (user && user.id) fetchMovimientos();
  }, [user]);

  // Agrupa movimientos por fecha
  const movimientosPorFecha = movimientos.reduce((acc, mov) => {
    const fecha = new Date(mov.fecha).toLocaleDateString();
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(mov);
    return acc;
  }, {});

  // Renderiza los movimientos en cada celda del calendario
  const tileContent = ({ date, view }) => {
    const fecha = date.toLocaleDateString();
    if (movimientosPorFecha[fecha]) {
      const items = movimientosPorFecha[fecha];

      const incomesExist = items.some(
        (mov) => mov.tipoMovimiento === "ingreso"
      );
      const outcomesExist = items.some((mov) => mov.tipoMovimiento === "gasto");

      //Limita a dos movimientos por fecha
      //Dentro de cada fecha buscar si hay ingresos

      return (
        <ul className="calendar">
          {incomesExist && (
            <li className="calendar__date calendar__date--income">●</li>
          )}

          {outcomesExist && (
            <li className="calendar__date calendar__date--outcome">●</li>
          )}
        </ul>
      );
    }
    return null;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date.toLocaleDateString());
  };

  const closeModal = () => setSelectedDate(null);

  const [selectedTab, setSelectedTab] = useState("mes");

  const tabs = [
    { label: "Mes", value: "mes" },
    {
      label: "Semana",
      value: "semana",
    },
  ];

  return (
    <div>
      <StatusBar label="Confimar transacciones" />

      {/*  <div className="tabs">
          {tabs.map(tab=> (
          <Tab 
          label={tab.label}
          key ={tab.value}
          isSelected={selectedTab === tab.value}
          onSelect={()=> setSelectedTab(tab.value)}/>
        ))}
      </div> */}

      {selectedTab === "mes" && (
        <>
          <div className="month-picker">
            <button
              onClick={() => {
                setSelectedDate(null); // Limpiar la selección
                setVisibleDate((prev) => subMonths(prev, 1));
              }}
              className="month-picker__button"
            >
              <img
                src="/assets/icons/arrow-left-light.svg"
                alt="Mes anterior"
              />
            </button>

            <div className="month-picker__info">
              <h3 className="month-picker__month">
                {format(visibleDate, "MMMM", { locale: es })}
              </h3>
              <p className="month-picker__year">
                {" "}
                {format(visibleDate, " yyyy", { locale: es })}
              </p>
            </div>

            {/* <div className="month-picker__nav"> */}

            <button
              onClick={() => {
                setSelectedDate(null); // Limpiar la selección
                setVisibleDate((prev) => addMonths(prev, 1));
              }}
              className="month-picker__button"
            >
              <img src="/assets/icons/arrow-right-light.svg" alt="" />
            </button>
            {/* </div> */}
          </div>

          <Calendar
            tileContent={tileContent}
            onClickDay={handleDayClick}
            view="month"
            maxDetail="month"
            activeStartDate={visibleDate} // 👈 Forzar mes visible
            value={selectedDate ? new Date(selectedDate) : null} // 👈 Solo marca el día si hay selección
            onActiveStartDateChange={({ activeStartDate }) =>
              setVisibleDate(activeStartDate)
            }
            showNavigation={false}
          />

          {selectedDate && movimientosPorFecha[selectedDate] && (
            <TransactionsModal
              selectedDate={selectedDate}
              movements={movimientosPorFecha}
              onClose={closeModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export { CalendarPage };
