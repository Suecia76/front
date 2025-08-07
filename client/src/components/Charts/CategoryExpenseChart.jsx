import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Chart from "react-apexcharts";
import { AuthContext } from "../../context/AuthContext";

const CategoryExpenseChart = () => {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchCategoryExpenses = async () => {
      try {
        const token = Cookies.get("token") || null;

        // Obtener los gastos agrupados por categoría
        const response = await axios.get(
          `https://app-nttd.onrender.com/gastos/usuario/${user.id}/categorias`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );

        const data = response.data;

        // Preparar los datos para el gráfico
        const categories = data.map((item) => item.categoria.nombre);
        const amounts = data.map((item) => item.total);

        setChartData({
          series: amounts,
          options: {
            chart: {
              type: "pie",
              height: 350,
            },
            labels: categories,
            colors: [
              "#2057F2", // blue
              "#426AE4", // indigo
              "#182B54", // dark-blue
              "#97B1F9", // light-blue
              "#28F1A4", // green
              "#AFFDDE", // light-green
            ],
            title: {
              text: "Gastos por Categoría",
              align: "center",
            },
            legend: {
              position: "bottom",
            },
          },
        });
      } catch (err) {
        console.error(
          "Error al obtener los gastos por categoría:",
          err.response?.data
        );
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryExpenses();
  }, [user]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h3>Gastos por Categoría</h3>
      {chartData.series.length > 0 ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height={350}
        />
      ) : (
        <p>No hay datos suficientes para generar el gráfico.</p>
      )}
    </div>
  );
};

export { CategoryExpenseChart };
