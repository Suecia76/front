import { NavigationCard2 } from "../../components/NavigationCard2";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { IncomeExpenseChart } from "../../components/Charts/IncomeExpenseChart";
import { TotalBalance } from "../../components/TotalBalance";
import { NotificationPrompt } from "../../components/NotificationPrompt";

const Home = () => {
  const navCards = [
    {
      label: "Ingresos",
      img: "assets/icons/Incomes.svg",
      link: "/incomes",
    },
    {
      label: "Gastos",
      img: "assets/icons/Gastos.svg",
      link: "/outcomes",
    },
    {
      label: "Metas",
      img: "assets/icons/Ahorro.svg",
      link: "/goals",
    },
    {
      label: "Categorías",
      img: "assets/icons/Categorias.svg",
      link: "/categories",
    },
  ];

  const carouselRef = useRef();
  const [width, setWidth] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState([]);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);
    const standalone = window.navigator.standalone === true;
    setIsInStandaloneMode(standalone);

    const el = carouselRef.current;
    if (el) {
      setWidth(el.scrollWidth - el.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        console.log("ID del usuario:", user.id); // Verificar ID
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/usuarios/saldo/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
            },
          }
        );
        setSaldo(response.data.saldo); // Actualizar el estado con el saldo obtenido
      } catch (error) {
        console.error("Error al obtener el saldo del usuario:", error);
      }
    };

    if (user && user.id) {
      fetchSaldo();
    }
  }, [user]);

  useEffect(() => {
    const resumenMensual = async () => {
      if (!user || !user.id) {
        console.error("El usuario no está definido o no tiene un ID.");
        return;
      }
      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/usuarios/${
            user.id
          }/resumen-mensual`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
            },
          }
        );

        setSummary(response.data);
        console.log("Resumen mensual:", response.data);
      } catch (error) {
        console.error("Error al obtener el resumen mensual:", error);
      }
    };

    resumenMensual();
  }, [setSummary, user]);
  // const options = ["Saldo total", "Saldo controlado", "Saldo disponible"];

  console.log(summary);
  return (
    <>
      <div id="home" className="autolayout-2">
        {/* Mostrar el saldo del usuario */}
        <TotalBalance saldo={parseFloat(saldo.toFixed(2))} />

        <section className="navigation">
          {navCards.map((card) => (
            <div key={card.label} className="navigation__card">
              <NavigationCard2
                label={card.label}
                link={card.link}
                img={card.img}
              />
            </div>
          ))}
        </section>

        {!isIos && (
          <section>
            <NotificationPrompt />
          </section>
        )}

        <section className="section-info" id="balance-status">
          <h2>Resumen Mensual</h2>

          <div className="summary">
            <div className="summary__item">
              <p className="summary__title">
                Ingresos del mes:{" "}
                <span className="summary__value">
                  {summary.totalIngresosMes !== undefined
                    ? summary.totalIngresosMes.toFixed(2)
                    : "-"}
                </span>
              </p>
            </div>
            <div className="summary__item">
              <p className="summary__title">
                Gastos del mes:{" "}
                <span className="summary__value">
                  {summary.totalGastosMes !== undefined
                    ? summary.totalGastosMes.toFixed(2)
                    : "-"}
                </span>
              </p>
            </div>
          </div>
          <div>
            <IncomeExpenseChart />
          </div>
        </section>
      </div>
    </>
  );
};

export { Home };
