import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import {useTeams} from "../context/TeamContext";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { tasks, deleteTask } = useTasks();
  const { teams, deleteTeam } = useTeams(); 
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const handleDeleteTask = () => {
    if (!selectedTaskId) return;
    deleteTask(selectedTaskId);
    setSelectedTaskId("");
  };

  const handleDeleteTeam = () => {
    if (!selectedTeamId) return;
    deleteTeam(selectedTeamId);
    setSelectedTeamId("");
        toast.success("Team deleted!")
  };

  return (
    <div className="d-flex min-vh-100 w-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-5">
        <h2 className="fw-bold mb-4">Settings</h2>

        {/* 1️⃣ User Profile Section */}
        <section className="mb-5">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-semibold mb-3">User Profile</h5>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <p className="mb-1">
                  <strong>Name:</strong> {user?.name || "—"}
                </p>
                <p className="mb-0 text-muted">
                  <strong>Email:</strong> {user?.email || "—"}
                </p>
              </div>

              <button className="btn btn-outline-danger" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          </div>
        </section>

        {/* 2️⃣ Danger Zone Section */}
        <section>
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-semibold mb-4">Manage</h5>

            {/* Delete Task */}
            <div className="mb-4">
              <label className="form-label fw-medium">Delete a Task</label>
              <div className="d-flex gap-2 flex-wrap">
                <select
                  className="form-select"
                  style={{ maxWidth: "300px" }}
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                >
                  <option value="">Select Task</option>
                  {tasks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteTask}
                  disabled={!selectedTaskId}
                >
                  Delete Task
                </button>
              </div>
            </div>

        
            <div>
              <label className="form-label fw-medium">Delete a Team</label>
              <div className="d-flex gap-2 flex-wrap">
                <select
                  className="form-select"
                  style={{ maxWidth: "300px" }}
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                  <option value="">Select Team</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteTeam}
                  disabled={!selectedTeamId}
                >
                  Delete Team
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
