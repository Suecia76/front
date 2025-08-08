import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { StatusBar } from "../../components/StatusBar";
import { OutcomesCard } from "../../components/Outcomes/OutcomesCard";
import { Link } from "react-router-dom";
import { FilterBar } from "../../components/Buttons/FilterBar";
import LoaderOverlay from "../../components/Animations/LoaderOverlay";

const Outcomes = () => {
  const { user } = useContext(AuthContext);
  const [gastos, setGastos] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recientes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const token = Cookies.get("token") || null;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/gastos/usuario/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        setGastos(response.data);
      } catch (error) {
        console.error("Error al obtener los gastos:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [user]);

  const sortOptions = [
    { value: "recientes", label: "Más recientes" },
    { value: "antiguos", label: "Más antiguos" },
    { value: "mayor", label: "Mayor cantidad" },
    { value: "menor", label: "Menor cantidad" },
    { value: "pendientes", label: "Pendientes" },
    { value: "confirmados", label: "Confirmados" },
  ];

  const filteredGastos = gastos
    .filter((gasto) =>
      gasto.nombre.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sort) {
        case "recientes":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "antiguos":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "mayor":
          return b.cantidad - a.cantidad;
        case "menor":
          return a.cantidad - b.cantidad;
        case "pendientes":
          return b.pendienteConfirmacion - a.pendienteConfirmacion;
        case "confirmados":
          return a.pendienteConfirmacion - b.pendienteConfirmacion;
        default:
          return 0;
      }
    });

  return (
    <>
      <LoaderOverlay isVisible={loading} />

      {!loading && (
        <div className="outcomes">
          <StatusBar label="Mis gastos" />

          {gastos.length > 0 ? (
            <>
              <FilterBar
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
                sortOptions={sortOptions}
                placeholder="Buscar gastos..."
              />

              <ul className="outcomes">
                {filteredGastos.map((gasto) => (
                  <OutcomesCard
                    key={gasto._id}
                    amount={gasto.cantidad}
                    title={gasto.nombre}
                    categoria_fk={gasto.categoria_fk}
                    state={
                      gasto.pendienteConfirmacion ? "Pendiente" : "Confirmado"
                    }
                    stateClassName={
                      gasto.pendienteConfirmacion ? "Pendiente" : "Confirmado"
                    }
                    _id={gasto._id}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p>No tienes gastos registrados.</p>
          )}

          <div className="outcomes__actions">
            <Link to="/outcome/add" className="btn btn--filled-blue">
              Añadir nuevo gasto
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export { Outcomes };
