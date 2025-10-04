  import { useEffect, useState } from "react";
  import { Line } from "react-chartjs-2";
  import api from "../../utils/api";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export default function WeeklyClosedTasksChart() {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchChartData = async () => {
        try {
          const res = await api.get("/reports/tasks/closed-last-week");
          const data = res.data;

          setChartData({
            labels: data.labels,
            datasets: [
              {
                label: "Tasks Closed",
                data: data.data,
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79,70,229,0.3)",
                tension: 0.3,
              },
            ],
          });
        } catch (err) {
          console.error("Error fetching weekly closed tasks:", err);
          setError("Failed to load weekly closed tasks.");
        }
      };

      fetchChartData();
    }, []);

    if (error) return <p className="text-danger">{error}</p>;
    if (!chartData) return <p>Loading weekly tasks chart...</p>;

    return (
      <div className="p-4 bg-white rounded-2xl shadow">
        <h4 className="mb-3 fw-bold">Tasks Closed (Last 7 days)</h4>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: false },
            },
              scales: {
      y: {
        ticks: {
          // Force integer labels
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          },
        },
        beginAtZero: true, // optional: start y-axis at 0
      },
    },
          }}
        />
      </div>
    );
  }
