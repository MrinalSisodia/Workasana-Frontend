import WeeklyClosedTasksChart from "../components/Charts/WeeklyClosedTasksChart";
import PendingWorkChart from "../components/Charts/PendingWorkChart";
import ClosedByGroupChart from "../components/Charts/ClosedByGroupChart";
import Sidebar from "../components/Sidebar";

function ChartCard({children }) {
  return (
    <div className="card p-4 shadow-sm mb-4" style={{ minHeight: "350px" }}>
      <div style={{ height: "100%" }}>{children}</div>
    </div>
  );
}

export default function ReportsDashboard() {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-5">
        <div className="container py-4">
          <h2 className="fw-bold mb-4">Reports</h2>

          {/* Row 1 */}
          <div className="row">
            <div className="col-md-6">
              <ChartCard>
                <WeeklyClosedTasksChart />
              </ChartCard>
            </div>
            <div className="col-md-6">
              <ChartCard>
                <PendingWorkChart />
              </ChartCard>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row">
            <div className="col-md-6">
              <ChartCard>
                <ClosedByGroupChart />
              </ChartCard>
            </div>
            {/* Optional: Add more charts here */}
          </div>
        </div>
      </main>
    </div>
  );
}
