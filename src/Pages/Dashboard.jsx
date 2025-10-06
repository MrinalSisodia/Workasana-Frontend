import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ProjectModal from "../components/ProjectModal";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";

const DashboardPage = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();
 const { user, loading: authLoading, ready } = useAuth();
    const navigate = useNavigate();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const taskStatuses = ["All", "To Do", "In Progress", "Completed", "Blocked"];

  // Filter tasks whenever tasks or status filter changes
  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((t) => t.status === statusFilter));
    }
  }, [tasks, statusFilter]);


  return (
    <div className="d-flex min-vh-100 w-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-5">
        {/* Search Bar 
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="Search..." />
          <button className="btn btn-outline-secondary" type="button">
            <i className="bi bi-search"></i>
          </button>
        </div> */}

        {/* Projects Section */}
        <section className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-semibold mb-0">Projects</h4>
            <button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
              + New Project
            </button>
          </div>

          {projectsLoading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            <div className="row g-4">
              {projects.map((p) => (
                <div key={p._id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card shadow-sm border-0 h-100"
                    style={{ cursor: "pointer" }}
            onClick={() => navigate(`/projects/${p._id}`)}
          >
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">{p.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tasks Section */}
        <section className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-semibold mb-0">My Tasks</h4>
              <select
                className="form-select form-select-sm"
                style={{ width: "150px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
              + New Task
            </button>
          </div>

        {tasksLoading || !user ? (
  <p>Loading tasks...</p>
) : filteredTasks.length === 0 ? (
  <p>No tasks found</p>
) : (
  <div className="row g-4">
    {filteredTasks.map((t) => (
      <div className="col-lg-3 col-md-4 col-sm-6" key={t._id}>
        <TaskCard task={t} />
      </div>
    ))}
  </div>
)}

        </section>

        {/* Modals */}
        <ProjectModal show={showProjectModal} onClose={() => setShowProjectModal(false)} />
        <TaskModal show={showTaskModal} onClose={() => setShowTaskModal(false)} />
      </main>
    </div>
  );
};

export default DashboardPage;
