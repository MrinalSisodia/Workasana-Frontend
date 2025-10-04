// TeamDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamContext";
import { useUsers } from "../context/UserContext";
import Sidebar from "../components/Sidebar";
import Avatar from "react-avatar";

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTeamById, updateTeamMembers } = useTeams();
  const { users, fetchUsers } = useUsers();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await getTeamById(id);
        setTeam(data);
        setSelectedMembers(data.members.map((m) => m._id));
      } catch {
        navigate("/teams");
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, [id, getTeamById, navigate]);

  useEffect(() => {
    if (showAddMember) fetchUsers();
  }, [showAddMember, fetchUsers]);

  const handleUpdateMembers = async () => {
    try {
      const updated = await updateTeamMembers(id, selectedMembers);
      setTeam(updated);
      setShowAddMember(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex min-vh-100 w-100 bg-light">
        <Sidebar />
        <main className="flex-grow-1 p-5">
          <p>Loading team...</p>
        </main>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="d-flex min-vh-100 w-100 bg-light">
        <Sidebar />
        <main className="flex-grow-1 p-5">
          <p>Team not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 w-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-5">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-link mb-3"
        >
          ← Back to Teams
        </button>

        <h4 className="fw-semibold mb-0">{team.name}</h4>
        <p className="text-muted mb-4">{team.description}</p>

        <h5 className="fw-semibold mb-3">Members</h5>
        <div className="d-flex flex-wrap gap-3">
          {team.members.map((member) => (
            <div key={member._id} className="d-flex align-items-center gap-2">
              <Avatar name={member.name} size="32" round={true} textSizeRatio={2} />
              <span>{member.name}</span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary mt-4"
          onClick={() => setShowAddMember(true)}
        >
          + Add / Edit Members
        </button>

        {showAddMember && (
  <div
    className="modal fade show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Update Team Members</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAddMember(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="row">
            {/* Available Users */}
            <div className="col-5">
              <h6>Available</h6>
              <ul className="list-group small">
                {users
                  ?.filter((u) => !selectedMembers.includes(u._id))
                  .map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.name}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setSelectedMembers([...selectedMembers, user._id])
                        }
                      >
                         <i className="bi bi-plus-square-fill"></i>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="col-2 d-flex align-items-center justify-content-center">
              <span className="fw-bold">⇄</span>
            </div>

            {/* Current Members */}
            <div className="col-5">
              <h6>Current Members</h6>
              <ul className="list-group small">
                {users
                  ?.filter((u) => selectedMembers.includes(u._id))
                  .map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.name}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          setSelectedMembers(
                            selectedMembers.filter((id) => id !== user._id)
                          )
                        }
                      >
                           <i className="bi bi-x-square-fill"></i>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddMember(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleUpdateMembers}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default TeamDetail;
