import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        "https://workasana-backend-liard.vercel.app/api/teams"
      );
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTeams();
  }, [token]);


 const createTeam = async (teamData) => {
  try {
    const res = await api.post("/teams", teamData);

    const newTeam = res.data.team;

    const teamWithMembers = {
      ...newTeam,
      members: newTeam.members || [],
    };

    setTeams((prev) => [...prev, teamWithMembers]);

    toast.success("Team created successfully");
    return teamWithMembers;
  } catch (error) {
    toast.error("Failed to create team");
    console.error("Error creating team:", error);
    throw error;
  }
};



  const getTeamById = async (teamId) => {
    try {
      const res = await api.get(
        `https://workasana-backend-liard.vercel.app/api/teams/${teamId}`
      );
      return res.data;
    } catch (err) {
      console.error("Failed to fetch team:", err);
      toast.error("Failed to fetch team");
      throw err;
    }
  };


  const updateTeamMembers = async (teamId, members) => {
    try {
      const res = await api.put(
        `https://workasana-backend-liard.vercel.app/api/teams/${teamId}/members`,
        { members }
      );

       const updatedTeam = res.data.team;

    setTeams((prev) =>
      prev.map((team) =>
        team._id === teamId ? { ...team, members: updatedTeam.members } : team
      )
    );


      toast.success("Team members updated successfully");
      return  updatedTeam;
    } catch (err) {
      console.error("Failed to update members:", err);
      toast.error("Failed to update team members");
      throw err;
    }
  };

  const deleteTeam = async (id) => {
  const prevTeams = [...teams]; // backup for rollback
  try {
    // Optimistically remove team from state
    setTeams(prev => prev.filter(t => t._id !== id));
    if (selectedTeam?._id === id) setSelectedTeam(null);

    // Call API
  
    await api.delete(`/teams/${id}`);

    toast.success("Team deleted");
  } catch (err) {
    // Rollback if API fails
    setTeams(prevTeams);
    console.error("Error deleting team:", err);
    toast.error("Failed to delete team. Please try again.");
  }
};


  return (
    <TeamContext.Provider
      value={{
        teams,
        loading,
        fetchTeams,
        createTeam,
        getTeamById,
        updateTeamMembers,
        deleteTeam
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => useContext(TeamContext);
