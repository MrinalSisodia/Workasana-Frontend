// components/TaskModal.jsx
import { useEffect, useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useProjects } from "../context/ProjectContext";
import { useTeams } from "../context/TeamContext";

const TaskModal = ({ show, onClose, taskToEdit, defaultProjectId }) => {
  const { createTask, updateTask } = useTasks();
  const { projects } = useProjects();
  const { teams } = useTeams();

  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [project, setProject] = useState("");
  const [team, setTeam] = useState("");
  const [owners, setOwners] = useState([]);
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Low");

  // Prefill fields when editing OR when defaultProjectId provided while creating
  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.name || "");
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 10) : "");
      setEstimatedTime(taskToEdit.timeToComplete || "");
      setProject(taskToEdit.project?._id || "");
      setTeam(taskToEdit.team?._id || "");
      setOwners(taskToEdit.owners?.map((o) => o._id) || []);
      setStatus(taskToEdit.status || "To Do");
      setPriority(taskToEdit.priority || "Medium");
    } else {
      // creating new task — apply defaultProjectId if provided
      setTaskName("");
      setDueDate("");
      setEstimatedTime("");
      setProject(defaultProjectId || "");
      setTeam("");
      setOwners([]);
      setStatus("To Do");
      setPriority("Medium");
    }
  }, [taskToEdit, defaultProjectId]);

  const teamMembers = useMemo(() => {
    const selected = teams.find((t) => t._id === team);
    return selected ? selected.members : [];
  }, [team, teams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: taskName,
      dueDate,
      timeToComplete: estimatedTime || undefined,
      project,
      team,
      owners,
      status,
      priority,
    };

    try {
      let savedTask;
      if (taskToEdit) {
        savedTask = await updateTask(taskToEdit._id, payload);
      } else {
        savedTask = await createTask(payload);
      }

      // Pass the saved/updated task back to caller so it can update local state
      onClose(savedTask);
    } catch (err) {
      console.error("Task save failed:", err);
      // keep modal open on error — you could surface error to UI here
    }
  };

  // If the user cancels/close, signal caller with `null`
  const handleCancel = () => onClose(null);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{taskToEdit ? "Edit Task" : "Create New Task"}</h5>
            <button type="button" className="btn-close" onClick={handleCancel}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body row g-3">
              {/* Task Name */}
              <div className="col-12">
                <label className="form-label">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>

              {/* Project */}
              <div className="col-md-6">
                <label className="form-label">Project</label>
                <select
                  className="form-select"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  required
                  // if defaultProjectId provided and we're creating a new task, lock the select by default
                  disabled={!!defaultProjectId && !taskToEdit}
                >
                  <option value="">Select a project</option>
                  {projects?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team */}
              <div className="col-md-6">
                <label className="form-label">Team</label>
                <select
                  className="form-select"
                  value={team}
                  onChange={(e) => {
                    setTeam(e.target.value);
                    setOwners([]);
                  }}
                  required
                >
                  <option value="">Select a team</option>
                  {teams?.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Owners */}
              <div className="col-12">
                <label className="form-label">Owners</label>
                <select
                  multiple
                  className="form-select"
                  value={owners}
                  onChange={(e) =>
                    setOwners([...e.target.selectedOptions].map((o) => o.value))
                  }
                  required
                  disabled={!team}
                >
                  {teamMembers?.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <div className="form-text">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</div>
              </div>

              {/* Due Date */}
              <div className="col-md-6">
                <label className="form-label">Select Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              {/* Estimated Time */}
              <div className="col-md-6">
                <label className="form-label">Estimated Time (Days)</label>
                <input
                  type="number"
                  className="form-control"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
              </div>

              {/* Status */}
              {taskToEdit && (
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              )}

              {/* Priority */}
              <div className="col-md-6">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {taskToEdit ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
