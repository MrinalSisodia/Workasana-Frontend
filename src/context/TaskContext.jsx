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

  const createTask = async (taskData) => {
  try {
    const res = await api.post("/tasks", taskData);

    const newTask = res.data.task;

    setTasks((prev) => [...prev, newTask]);

    toast.success("Task created successfully");

    return newTask;
  } catch (err) {
    console.error("Error creating task:", err);
    toast.error("Failed to create task");
    throw err; // rethrow so modal can handle it
  }
};

   const updateTask = async (taskId, updatedData) => {
    setLoading(true);
    try {
      await api.put(`/tasks/${taskId}`, updatedData);

      const res = await api.get(`/tasks/${taskId}`);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );

      if (selectedTask?._id === taskId) setSelectedTask(res.data);

      toast.success("Task updated successfully");
      return res.data;
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
  const prevTasks = [...tasks]; // backup for rollback
  try {
    // Optimistically remove team from state
    setTasks(prev => prev.filter(t => t._id !== id));
    if (selectedTask?._id === id) setSelectedTask(null);

    // Call API
  
    await api.delete(`/tasks/${id}`);

    toast.success("Task deleted!");
  } catch (err) {
    // Rollback if API fails
    setTeams(prevTeams);
    console.error("Error deleting task:", err);
    toast.error("Failed to delete task. Please try again.");
  }
};



 useEffect(() => {
   if (user?._id) {
     fetchTasks();
   } else {
     setTasks([]);
   }
 }, [user?._id, fetchTasks]);

  return (
    <TaskContext.Provider
      value={{ tasks, selectedTask, loading, fetchTasks, setSelectedTask, createTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
