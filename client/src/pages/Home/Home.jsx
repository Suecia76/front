import { NavigationCard2 } from "../../components/NavigationCard2";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios"; // Importar axios para realizar solicitudes HTTP
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { IncomeExpenseChart } from "../../components/Charts/IncomeExpenseChart";
import { TotalBalance } from "../../components/TotalBalance";
import { NotificationPrompt } from "../../components/NotificationPrompt";

const Home = () => {
  /* List of navigation cards */
  const navCards = [
    {
      label: "Ingresos",
      img: "./src/assets/icons/Incomes.svg",
      link: "/incomes",
    },
    {
      label: "Gastos",
      img: "./src/assets/icons/Gastos.svg",
      link: "/outcomes",
    },
    {
      label: "Metas",
      img: "./src/assets/icons/Ahorro.svg",
      link: "/goals",
    },
    {
      label: "Categorias",
      img: "./src/assets/icons/Categorias.svg",
      link: "/categories",
    },
  ];

  const carouselRef = useRef();
  const [width, setWidth] = useState(0);
  const [saldo, setSaldo] = useState(0); // Estado para almacenar el saldo del usuario
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      setWidth(el.scrollWidth - el.offsetWidth);
    }
  }, []);

  useEffect(() => {
    // Obtener el saldo del usuario desde el backend
    const fetchSaldo = async () => {
      if (!user || !user.id) {
        console.error("El usuario no está definido o no tiene un ID.");
        return;
      }

      try {
        user.id = user.id; // Asegurarse de que el ID sea una cadena
        console.log("ID del usuario:", user.id); // Verificar el ID del usuario
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/usuarios/saldo/${user.id}`,
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

    fetchSaldo();
  }, [user]);

  const options = ["Saldo total", "Saldo controlado", "Saldo disponible"];

  return (
    <>
      <div id="home" className="autolayout-2">
        {/* <h1>Bienvenido, Usuario</h1> */}

        {/* Mostrar el saldo del usuario */}
        <TotalBalance saldo={saldo} options={options} />

        {/*   <section className="carousel">
        <motion.div
          ref={carouselRef}
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="carousel-inner"
        >
          {navCards.map((card) => (
            <motion.div
              className="carousel-item"
              key={card.label}
            >
              <NavigationCard label={card.label} link={card.link} img={card.img} />
            </motion.div>
          ))}
        </motion.div>
      </section> */}

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

        <section className="section-info" id="balance-status">
          <div>
            <IncomeExpenseChart />
          </div>
          <p>Mensaje</p>
        </section>

        <section className="section-info" id="goals-status">
          <div>Card de meta</div>
          {user && <NotificationPrompt userId={user.id} />}
        </section>
      </div>
    </>
  );
};

export { Home };
