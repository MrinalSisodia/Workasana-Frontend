import { useState, useEffect } from "react";
import { useTeams } from "../context/TeamContext";
import { useUsers } from "../context/UserContext";

const TeamModal = ({show, onClose}) => {
    const {createTeam} = useTeams(); 
     const { users, fetchUsers } = useUsers(); 
    const [teamName, setTeamName] = useState("")
    const [teamDescription, setTeamDescription] = useState("")
    const [teamMembers, setTeamMembers] = useState([])

     useEffect(() => {
    if (show) {
      fetchUsers(); // load users when modal opens
    }
  }, [show, fetchUsers]);

    const handleSubmit = async(e)=> {
        e.preventDefault(); 
         try {
           await createTeam({
            name: teamName,
            description: teamDescription,
            members: teamMembers
           }); 
           setTeamName("");
           setTeamDescription("");
           setTeamMembers([]);
           onClose();
         } catch (err) {
            console.error(err);
         }
    }

    if (!show) return null;

    return(
        <div className="modal fade show d-block"
         style={{ backgroundColor: "rgba(0,0,0,0.5)" }} >
         <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Team</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Team Name */}
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              {/* Team Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                />
              </div>

              {/* Team Members */}
              <div className="mb-3">
                <label className="form-label">Team Members</label>
                <select
                  multiple
                  className="form-select"
                  value={teamMembers}
                  onChange={(e) =>
                    setTeamMembers(
                      Array.from(e.target.selectedOptions, (opt) => opt.value)
                    )
                  }
                >
                  {users?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={onClose}
                >
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
        </div>
    )
}

export default TeamModal;