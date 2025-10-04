import { useState } from "react";
import { useProjects } from "../context/ProjectContext";

const ProjectModal = ({ show, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const { createProject } = useProjects();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(projectName, projectDesc);

      // Reset form
      setProjectName("");
      setProjectDesc("");

      // Close modal
      onClose();
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Project</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Project Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
