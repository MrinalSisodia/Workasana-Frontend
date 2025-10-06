// src/context/ProjectContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchProjects();
}, []);

  const fetchProjects =  useCallback(async () => {
  if (!user?._id) return;
  try {
    setLoading(true);
    const res = await api.get("/projects");
    setProjects(res.data);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    toast.error("Failed to load projects");
  } finally {
    setLoading(false);
  }
}, [user?._id]);


  const fetchProjectByID = async(projectId) => {
    try {
      const res = await api.get(`https://workasana-backend-liard.vercel.app/api/projects/${projectId}`)
    return res.data;
    } catch (err) {
      console.error("Failed to fetch project:", err);
      toast.error("Failed to fetch project");
      throw err;
    }
  }


  const createProject = async (name, description) => {
    try {
      const res = await api.post(
        "https://workasana-backend-liard.vercel.app/api/projects",
        { name, description });
      setProjects((prev) => [...prev, res.data]); // update state immediately
      return res.data;
      toast.success("Project added sccsessfully");
    } catch (err) {
      console.error("Error creating project:", err);
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{ projects, loading, fetchProjects, createProject, fetchProjectByID }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
