import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const res = await api.get("/tasks", { params: { owner: user._id } });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

 useEffect(() => {
   if (user?._id) {
     fetchTasks();
   } else {
     setTasks([]);
   }
 }, [user?._id, fetchTasks]);

  return (
    <TaskContext.Provider
      value={{ tasks, selectedTask, loading, fetchTasks, setSelectedTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
