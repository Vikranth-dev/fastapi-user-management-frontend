import { useState, useEffect } from "react";
import API from "../services/api"; // your API helper

export default function useTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks for the logged-in user
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await API.get("/tasks/");
      setTasks(response.data); // assuming API returns an array of tasks
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await API.post("/tasks/", taskData);
      setTasks((prev) => [...prev, response.data]); // add new task to state
      setError(null);
      return response.data;
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (taskId, updatedData) => {
    setLoading(true);
    try {
      const response = await API.put(`/tasks/${taskId}`, updatedData);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? response.data : t)),
      );
      setError(null);
      return response.data;
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when hook mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
