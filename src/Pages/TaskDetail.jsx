import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import Sidebar from "../components/Sidebar";
import TaskModal from "../components/TaskModal";
import Avatar from "react-avatar";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, fetchTasks, updateTask, loading } = useTasks();

  const [task, setTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load task either from context or fetch if missing
  useEffect(() => {
    const loadTask = async () => {
      const found = tasks.find((t) => t._id === id);
      if (found) {
        setTask(found);
      } else {
        await fetchTasks();
      }
    };
    loadTask();
  }, [id, tasks, fetchTasks]);

  // Re-sync task when tasks list updates
  useEffect(() => {
    const found = tasks.find((t) => t._id === id);
    if (found) setTask(found);
  }, [tasks, id]);

  const handleMarkComplete = async () => {
    if (task) {
      await updateTask(task._id, { status: "Completed" });
    }
  };

  if (loading && !task) {
    return (
      <div className="d-flex min-vh-100 w-100 bg-light">
        <Sidebar />
        <main className="flex-grow-1 p-5 d-flex align-items-center justify-content-center">
          <p>Loading task...</p>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="d-flex min-vh-100 w-100 bg-light">
        <Sidebar />
        <main className="flex-grow-1 p-5">
          <p>Task not found.</p>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </main>
      </div>
    );
  }

  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "Not set";

  const timeRemaining = task.dueDate
    ? (() => {
        const diffDays = Math.ceil(
          (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return diffDays > 0 ? `${diffDays} day(s)` : "Past due";
      })()
    : "";

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-4">
         <button 
      className="btn btn-outline-secondary me-3 mb-3"
      onClick={() => navigate(-1)} 
    >
      ← Back
    </button>
        {/* Header */}
        <div className="border-bottom pb-3 mb-4">
          <h3 className="fw-semibold mb-0">Task: {task.name}</h3>
        </div>

        <div className="d-flex flex-column flex-md-row">
          <div className="flex-grow-1 ps-md-4">
            {/* Task Info */}
            <div className="mb-4">
              {[
                ["Project", task.project?.name],
                ["Team", task.team?.name],
              ].map(([label, value]) => (
                <div key={label} className="row mb-2">
                  <div className="col-sm-3 fw-semibold">{label}:</div>
                  <div className="col-sm-9">{value || <em>Not set</em>}</div>
                </div>
              ))}

              <div className="row mb-2">
                <div className="col-sm-3 fw-semibold">Owners:</div>
                <div className="col-sm-9">
                  {task.owners?.length ? (
                    <div className="d-flex flex-wrap gap-2">
                      {task.owners.map((o) => (
                        <div
                          key={o._id}
                          className="d-flex align-items-center gap-2 border rounded-pill px-2 py-1 bg-light"
                        >
                          <Avatar name={o.name} size="26" round textSizeRatio={2} />
                          <span className="small">{o.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <em>No owners assigned</em>
                  )}
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-sm-3 fw-semibold">Tags:</div>
                <div className="col-sm-9">
                  {task.tags?.length ? (
                    task.tags.map((tag) => (
                      <span key={tag} className="badge bg-secondary me-1">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <em>No tags</em>
                  )}
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-sm-3 fw-semibold">Due Date:</div>
                <div className="col-sm-9">{dueDateFormatted}</div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="border-top pt-3">
              <div className="row mb-2">
                <div className="col-sm-3 fw-semibold">Status:</div>
                <div className="col-sm-9">
                  <span
                    className={`badge ${
                      task.status === "Completed"
                        ? "bg-success"
                        : task.status === "In Progress"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3 fw-semibold">Time Remaining:</div>
                <div className="col-sm-9">{timeRemaining || "N/A"}</div>
              </div>

              <div className="row g-2">
                <div className="col-auto">
                  <button
                    className="btn btn-success"
                    onClick={handleMarkComplete}
                    disabled={task.status === "Completed"}
                  >
                    {task.status === "Completed" ? "✅ Completed" : "Mark as Complete"}
                  </button>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showEditModal && (
          <TaskModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            taskToEdit={task}
          />
        )}
      </main>
    </div>
  );
};

export default TaskDetail;
