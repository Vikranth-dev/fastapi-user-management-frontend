import { useState } from "react";
import API from "../services/api";
import "../styles/task.css";
const ALLOWED_STATUSES = ["Todo", "In Progress", "Done"];

export default function Task({
  type,
  tasks = [],
  selectedTask,
  setSelectedTask,
  refreshTasks,
}) {
  // ---------- Create state ----------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ---------- Update state ----------
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [status, setStatus] = useState("Todo");

  // ---------- Async flow states ----------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------- Handlers ----------
  const handleCreate = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // Validation
  if (!title.trim()) {
    setError("Title is required");
    return;
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    setError("Invalid task status");
    return;
  }
  setLoading(true);
  try {
    await API.post("/tasks/", { title, description, status });

      setTitle("");
      setDescription("");
      refreshTasks();
      setSuccess("Task created successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
  setError("");
  setSuccess("");

  if (!selectedTask) {
    setError("Select a task to update");
    return;
  }
  // Validation
  if (!editTitle.trim()) {
    setError("Title cannot be empty");
    return;
  }
  if (!editDescription.trim()) {
    setError("Description cannot be empty");
    return;
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    setError("Invalid task status");
    return;
  }
  setLoading(true);
  try {

      await API.put(`/tasks/${selectedTask.id}`, {
        title: editTitle,
        description: editDescription,
        status,
      });
      refreshTasks();
      setSuccess("Task updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return setError("Select a task to delete");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.delete(`/tasks/${selectedTask.id}`);
      setSelectedTask(null);
      refreshTasks();
      setSuccess("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div>
      {/* Messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Create Tab */}
      {type === "create" && (
        <form onSubmit={handleCreate} className="task-form">
          <h2>Create Task</h2>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {/* List Tab */}
      {type === "list" && (
        <table className="task-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.task_number}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  {task.created_at
                    ? new Date(task.created_at).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Update/Delete Tab */}
      {(type === "update" || type === "delete") && (
        <div>
          <h2>{type === "update" ? "Update Task" : "Delete Task"}</h2>

          {/* Task selector */}
          <select
            className="task-select"
            value={selectedTask?.id || ""}
            onChange={(e) => {
              const task = tasks.find(
                (t) => t.id === parseInt(e.target.value)
              );
              setSelectedTask(task);
              if (task) {
                setEditTitle(task.title);
                setEditDescription(task.description);
                setStatus(task.status);
              }
            }}
          >
            <option value="">Select Task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.task_number}. {task.title} ({task.status})
              </option>
            ))}
          </select>

          {/* Update Form */}
          {type === "update" && selectedTask && (
            <div style={{ marginTop: "1rem" }}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                required
              />
              <br />
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
              />
              <br />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <br />
              <button onClick={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update Task"}
              </button>
            </div>
          )}

          {/* Delete Button */}
          {type === "delete" && selectedTask && (
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
