import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { IncomesCard } from "../../components/Incomes/IncomesCard";
import { Link } from "react-router-dom";
import { FilterBar } from "../../components/Buttons/FilterBar";

const Incomes = () => {
  const { user, loading } = useContext(AuthContext);
  const [ingresos, setIngresos] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recientes");

  useEffect(() => {
    const fetchIngresos = async () => {
      if (loading || !user?.id) return;

      try {
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `https://back-fbch.onrender.com/ingresos/usuario/${user.id}`,
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
  }, [user, loading]);

  const sortOptions = [
    { value: "recientes", label: "Más recientes" },
    { value: "antiguos", label: "Más antiguos" },
    { value: "pendientes", label: "Pendientes" },
    { value: "confirmados", label: "Confirmados" },
    { value: "mayor", label: "Mayor cantidad" },
    { value: "menor", label: "Menor cantidad" },
  ];

  const filteredIngresos = ingresos
    .filter((ingreso) =>
      ingreso.nombre.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sort) {
        case "recientes":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "antiguos":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "pendientes":
          return b.pendienteConfirmacion - a.pendienteConfirmacion;
        case "confirmados":
          return a.pendienteConfirmacion - b.pendienteConfirmacion;
        case "mayor":
          return b.cantidad - a.cantidad;
        case "menor":
          return a.cantidad - b.cantidad;
        default:
          return 0;
      }
    });

  return (
    <>
      <div>
        <StatusBar label="Mis ingresos" />

        {ingresos.length > 0 ? (
          <>
            <FilterBar
              search={search}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              sortOptions={sortOptions}
              placeholder="Buscar ingresos..."
            />
            <ul className="incomes">
              {filteredIngresos.map((ingreso) => (
                <IncomesCard
                  key={ingreso._id}
                  _id={ingreso._id}
                  title={ingreso.nombre}
                  amount={ingreso.cantidad}
                  categoria_fk={ingreso.categoria_fk}
                  state={
                    ingreso.pendienteConfirmacion ? "Pendiente" : "Confirmado"
                  }
                  stateClassName={
                    ingreso.pendienteConfirmacion ? "Pendiente" : "Confirmado"
                  }
                />
              ))}
            </ul>
          </>
        ) : (
          <p>No tienes ingresos registrados.</p>
        )}

        <div className="incomes__actions">
          <Link to="/income/add" className="btn btn--filled-blue">
            Añadir nuevo ingreso
          </Link>
        </div>
      </div>
    </>
  );
};

export { Incomes };
