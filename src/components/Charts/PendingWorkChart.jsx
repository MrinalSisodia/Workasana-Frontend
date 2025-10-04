import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import api from "../../utils/api"; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PendingWorkChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchPendingWork = async () => {
      try {
        const res = await api.get("/reports/tasks/pending-summary"); // ✅ axios GET
        const data = res.data;

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Total Estimated Days Pending",
              data: data.data,
              backgroundColor: "rgba(16,185,129,0.7)"
            }
          ]
        });
      } catch (err) {
        console.error("❌ Error fetching pending work:", err);
      }
    };

    fetchPendingWork();
  }, []);

  if (!chartData) return <p>Loading pending work chart...</p>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h4 className="mb-3 fw-bold">Total Work Pending (Days)</h4>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { title: { display: true, text: "Project" } },
            y: { title: { display: true, text: "Estimated Days" } },
          }
        }}
      />
    </div>
  );
}
