import { useEffect, useState, useContext } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext.jsx";

const GoalsProgressByMonthChart = () => {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState({ series: [], options: {} });

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        const token = Cookies.get("token") || null;
        const res = await axios.get(
          `http://localhost:3000/metas/usuario/${user.id}/avances-mes`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );
        const avances = res.data;
        console.log("Avances por mes:", avances);

        // Transforma el objeto en arrays
        const meses = Object.keys(avances);
        const cantidades = Object.values(avances);

        if (!meses.length || !cantidades.length) {
          setChartData({ series: [], options: {} });
          return;
        }

        setChartData({
          series: [{ name: "Avance", data: cantidades }],
          options: {
            chart: { type: "bar", height: 350 },
            xaxis: { categories: meses },
            title: { text: "Avance de metas por mes" },
            colors: ["#007bff"],
          },
        });
      } catch (error) {
        console.error("Error al obtener avances por mes:", error);
        setChartData({ series: [], options: {} });
      }
    };

    fetchData();
  }, [user]);

  return (
    <div>
      <h3>Avance mensual en metas</h3>
      {chartData.series.length > 0 ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      ) : (
        <p>No hay datos para mostrar</p>
      )}
    </div>
  );
};

export { GoalsProgressByMonthChart };
