// TeamsPage.jsx
import { useState } from "react";
import { useTeams } from "../context/TeamContext";
import Sidebar from "../components/Sidebar";
import TeamModal from "../components/TeamModal";
import { useNavigate } from "react-router-dom";

const TeamsPage = () => {
  const { teams, fetchTeams, loading } = useTeams();
  const [showTeamModal, setShowTeamModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="d-flex min-vh-100 w-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-5">
        <section className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-semibold mb-0">Teams</h4>
            <button
              className="btn btn-primary"
              onClick={() => setShowTeamModal(true)}
            >
              + New Team
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="row g-4">
              {teams.map((t) => (
                <div key={t._id} className="col-lg-3 col-md-4 col-sm-6">
                  <div
                    className="card shadow-sm border-0 h-100 team-card"
                    role="button"
                    onClick={() => navigate(`/teams/${t._id}`)}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{t.name}</h5>
                      <p className="card-text text-muted">{t.description}</p>

                      {/* Show member avatars inline */}
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {(t.members || []).slice(0, 3).map((m) => (
                          <div key={m._id} title={m.name}>
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                m.name
                              )}&background=random&rounded=true&size=32`}
                              alt={m.name}
                              className="rounded-circle"
                            />
                          </div>
                        ))}
                        {(t.members || []).length > 3 && (
                          <span className="text-muted small align-self-center">
                            +{t.members.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <TeamModal
          show={showTeamModal}
          onClose={() => setShowTeamModal(false)}
        />
      </main>
    </div>
  );
};

export default TeamsPage;
