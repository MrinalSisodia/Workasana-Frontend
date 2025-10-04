import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card shadow-sm border-0 h-100 cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div className="card-body">
        <span className="badge bg-warning text-dark mb-2">{task.status}</span>
        <h5 className="card-title">{task.name}</h5>
        <div className="d-flex gap-1 flex-wrap">
          {task.owners.slice(0, 5).map((o) => (
            <Avatar
              key={o._id}
              name={o.name}
              size="32"
              round={true}
              textSizeRatio={2}
            />
          ))}
          {task.owners.length > 5 && (
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white" style={{ width: "32px", height: "32px", fontSize: "0.75rem" }}>
              +{task.owners.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
