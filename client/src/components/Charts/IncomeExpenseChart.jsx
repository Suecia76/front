import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Chart from "react-apexcharts";
import { AuthContext } from "../../context/AuthContext";

const IncomeExpenseChart = () => {
  const { user } = useContext(AuthContext);
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [chartData, setChartData] = useState({ series: [], options: {} });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = Cookies.get("token") || null;

        // Obtener ingresos
        const ingresosRes = await axios.get(
          `https://back-fbch.onrender.com/ingresos/usuario/${user.id}`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        setIngresos(ingresosRes.data);

        // Obtener gastos
        const gastosRes = await axios.get(
          `https://back-fbch.onrender.com/gastos/usuario/${user.id}`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        setGastos(gastosRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error.response?.data);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (ingresos.length > 0 || gastos.length > 0) {
      const fechas = [
        ...new Set(
          [...ingresos, ...gastos].map((item) =>
            new Date(item.createdAt).toLocaleDateString()
          )
        ),
      ];

      const ingresosData = fechas.map((fecha) =>
        ingresos
          .filter(
            (ingreso) =>
              new Date(ingreso.createdAt).toLocaleDateString() === fecha
          )
          .reduce((total, ingreso) => total + ingreso.cantidad, 0)
      );

      const gastosData = fechas.map((fecha) =>
        gastos
          .filter(
            (gasto) => new Date(gasto.createdAt).toLocaleDateString() === fecha
          )
          .reduce((total, gasto) => total + gasto.cantidad, 0)
      );

      setChartData({
        series: [
          { name: "Ingresos", data: ingresosData },
          { name: "Gastos", data: gastosData },
        ],
        options: {
          chart: { type: "line", height: 350, width: "100%" },
          xaxis: { categories: fechas },
          stroke: { curve: "smooth" },
          colors: ["#28a745", "#dc3545"],
          title: { text: "Comparación de Ingresos vs Gastos" },
          dataLabels: { enabled: false },
        },
      });
    }
  }, [ingresos, gastos]);

  return (
    <div>
      <h3>Resumen de Ingresos y Gastos</h3>
      {chartData.series.length > 0 ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
          width="100%"
        />
      ) : (
        <p>No hay datos suficientes para generar el gráfico.</p>
      )}
    </div>
  );
};

export { IncomeExpenseChart };
