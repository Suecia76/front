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

  useEffect(() => {
    const fetchMovimientos = async () => {
      const token = Cookies.get("token");
      const res = await axios.get(
        `https://back-fbch.onrender.com/usuarios/calendario/${user.id}`,
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

      return (
        <ul
          className="calendar"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {items.slice(0, 2).map((mov, index) => (
            <li
              key={index}
              className={`calendar__date calendar__date--${
                mov.tipoMovimiento === "ingreso" ? "income" : "outcome"
              }`}
            >
              ●
            </li>
          ))}
          {items.length > 2 && (
            <li style={{ fontSize: "0.8em" }}>+{items.length - 2} más</li>
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

      {selectedTab === "mes" && (
        <>
          <div className="month-picker">
            <h3>{format(visibleDate, "MMMM yyyy", { locale: es })}</h3>

            <button
              onClick={() => setVisibleDate((prev) => subMonths(prev, 1))}
            >
              Mes anterior
            </button>

            <button
              onClick={() => setVisibleDate((prev) => addMonths(prev, 1))}
            >
              Mes siguiente
            </button>
          </div>

          <Calendar
            tileContent={tileContent}
            onClickDay={handleDayClick}
            view="month"
            maxDetail="month"
            // minDate={startOfMonth(new Date())}
            // maxDate={startOfMonth(new Date())}
            value={visibleDate}
            onChange={setVisibleDate}
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
