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

  // ---------- Delete/Search ----------
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered tasks for search
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------- Handlers ----------
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
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
      await API.put(`/tasks/${selectedTask.id}`, {title: editTitle,description: editDescription,status,});
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
    if (!selectedTask) {
      setError("Select a task to delete");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;
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
    <div className="task-container">
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
        <div>
          <input
            placeholder="Search task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
          />
          {filteredTasks.length === 0 ? (
            <p>No tasks found</p>
          ) : 
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
              {(searchTerm ? filteredTasks : tasks).map((task) => (
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
}
        </div>
      )}

      {/* Update/Delete Tab */}
      {(type === "update" || type === "delete") && (
        <div>
          <h2>{type === "update" ? "Update Task" : "Delete Task"}</h2>

          {/* Search bar */}
          <input
            placeholder="Search task..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedTask(null); // Reset selection on new search
            }}
            style={{ marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
          />

         {/* Only show tasks if search term is entered */}
{searchTerm && (
  filteredTasks.length > 0 ? (
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
        {filteredTasks.map((task) => (
          <tr
            key={task.id}
            style={{
              backgroundColor:
                selectedTask?.id === task.id ? "#f0f8ff" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedTask(task);
              if (type === "update") {
                setEditTitle(task.title);
                setEditDescription(task.description);
                setStatus(task.status);
              }
            }}
          >
            <td>{task.task_number}</td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{task.status}</td>
            <td>{task.created_at ? new Date(task.created_at).toLocaleString() : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No tasks found</p>
  )
)}

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
                {ALLOWED_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
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
              <button onClick={handleDelete} disabled={!selectedTask || loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}