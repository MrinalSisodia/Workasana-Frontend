import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import api from "../../utils/api"; 

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ClosedByGroupChart() {
  const [groupBy, setGroupBy] = useState("team");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchClosedByGroup = async () => {
      try {
        const res = await api.get(`/reports/tasks/closed-by-group`, {
          params: { groupBy },
        });

        const data = res.data;

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: `Tasks Closed by ${groupBy}`,
              data: data.data,
              backgroundColor: [
                "#6366F1", "#10B981", "#F59E0B", "#EF4444",
                "#3B82F6", "#8B5CF6", "#14B8A6", "#F97316"
              ],
              borderWidth: 1
            }
          ]
        });
      } catch (err) {
        console.error("Error fetching closed by group:", err);
      }
    };

    fetchClosedByGroup();
  }, [groupBy]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Tasks Closed by Group</h4>
        <select
          className="form-select w-auto"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="team">Team</option>
          <option value="owner">Owner</option>
          <option value="project">Project</option>
        </select>
      </div>

      {chartData ? (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "right" },
            }
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}
