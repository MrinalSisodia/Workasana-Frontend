import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import Sidebar from "../components/Sidebar";
import TaskModal from "../components/TaskModal";

const ProjectDetail = () => {
  const { fetchProjectByID } = useProjects();
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

    const [showTaskModal, setShowTaskModal] = useState(false);

  // 🟡 Sort & Filter States
  const [sortOption, setSortOption] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // 🟡 Fetch Project Data
  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        const data = await fetchProjectByID(id);
        setProject(data);
      } catch (error) {
        console.log(error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id, fetchProjectByID, navigate]);


  
  // 🔸 Priority badge styling helper
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "badge bg-danger";
      case "Medium":
        return "badge bg-warning text-dark";
      case "Low":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };

  // 🔸 Status badge styling helper
  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "badge bg-primary";
      case "In Progress":
        return "badge bg-info text-dark";
      case "Completed":
        return "badge bg-success";
      case "On Hold":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  // 🔸 Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🟡 Derived Task List with Sorting & Filtering
  const displayedTasks = useMemo(() => {
    if (!project?.tasks) return [];

    let result = [...project.tasks];

    // Filter by owner
    if (selectedOwner) {
      result = result.filter(task =>
        task.owners.some(o => o._id === selectedOwner)
      );
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter(task => task.tags?.includes(selectedTag));
    }

    // Sort by selected option
    if (sortOption === "priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (sortOption === "dueDate") {
      result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return result;
  }, [project, sortOption, selectedOwner, selectedTag]);

  // 🟡 Collect unique owners & tags for dropdowns
  const ownerOptions = useMemo(() => {
    const allOwners = project?.tasks?.flatMap(t => t.owners) || [];
    const unique = new Map();
    allOwners.forEach(o => unique.set(o._id, o));
    return Array.from(unique.values());
  }, [project]);

  const tagOptions = useMemo(() => {
    const allTags = project?.tasks?.flatMap(t => t.tags || []) || [];
    return Array.from(new Set(allTags));
  }, [project]);



  // open create modal and prefill project
  const openAddTaskModal = () => {
    setShowTaskModal(true);
  };

 

  // handle close of modal: savedTask is object (created/updated), null means cancelled
  const handleTaskModalClose = (savedTask) => {
    setShowTaskModal(false);

    if (!savedTask) {
      // user cancelled or closed without saving -> do nothing
      return;
    }

    // savedTask returned — update local project.tasks (replace if exists or prepend)
    setProject((prev) => {
      if (!prev) return prev;
      const tasks = [...(prev.tasks || [])];
      const idx = tasks.findIndex((t) => t._id === savedTask._id);
      if (idx >= 0) {
        tasks[idx] = savedTask; // updated
      } else {
        tasks.unshift(savedTask); // new task: add to top (you can push instead)
      }
      return { ...prev, tasks };
    });
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <Sidebar />
        <main className="flex-grow-1 p-5 d-flex justify-content-center align-items-center">
          <div>...Loading project</div>
        </main>
      </div>
    );
  }


  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <button
          className="btn btn-outline-secondary me-3 mb-5"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="border-bottom pb-3 mb-4">
          <h3 className="fw-semibold mb-2">Project: {project.name}</h3>
          <p>{project.description}</p>
        </div>

        {/* 🔽 Sort & Filter Row */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-8 d-flex flex-wrap gap-2">
            {/* Sort */}
            <select
              className="form-select form-select-sm w-auto"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>

            {/* Filter by Owner */}
            <select
              className="form-select form-select-sm w-auto"
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
            >
              <option value="">Filter by Owner</option>
              {ownerOptions.map(o => (
                <option key={o._id} value={o._id}>{o.name}</option>
              ))}
            </select>

            {/* Filter by Tag */}
            <select
              className="form-select form-select-sm w-auto"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">Filter by Tag</option>
              {tagOptions.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Clear */}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSortOption("");
                setSelectedOwner("");
                setSelectedTag("");
              }}
            >
              Clear
            </button>
          </div>

          <div className="col-md-4 text-md-end mt-2 mt-md-0">
            <button className="btn btn-primary" onClick={openAddTaskModal}>
              + Add Task
            </button>
          </div>
        </div>

        {/* 📋 Task Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Task</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Due On</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayedTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                displayedTasks.map((t) => (
                  <tr
                    key={t._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tasks/${t._id}`)}
                  >
                    <td>{t.name}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {t.owners.slice(0, 2).map((o, idx) => (
                          <div
                            key={idx}
                            className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-1"
                            style={{ width: 24, height: 24, fontSize: 12 }}
                          >
                            {o.name[0]}
                          </div>
                        ))}
                        {t.owners.length > 2 && (
                          <div
                            className="rounded-circle bg-light border d-flex justify-content-center align-items-center"
                            style={{ width: 24, height: 24, fontSize: 12 }}
                          >
                            +{t.owners.length - 2}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={getPriorityClass(t.priority)}>
                        {t.priority}
                      </span>
                    </td>
                    <td>{formatDate(t.dueDate)}</td>
                    <td>
                      <span className={getStatusClass(t.status)}>{t.status}</span>
                    </td>
                    <td>
                      <i className="bi bi-arrow-right text-muted"></i>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
           <TaskModal
          show={showTaskModal}
          onClose={handleTaskModalClose}
          defaultProjectId={project?._id}
        />
      </main>
    </div>
  );
};

export default ProjectDetail;
