import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Task from "../components/Task";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [tab, setTab] = useState("create");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const navigate = useNavigate();

  // Fetch tasks whenever tab changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const response = await API.get("/tasks/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tasks. Please login again.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (["list", "update", "delete"].includes(tab)) {
      fetchTasks();
    }
  }, [tab, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-actions">
        <button onClick={() => setTab("create")} disabled={tab === "create"}>
          Create Task
        </button>
        <button onClick={() => setTab("list")} disabled={tab === "list"}>
          List Tasks
        </button>
        <button onClick={() => setTab("update")} disabled={tab === "update"}>
          Update Task
        </button>
        <button onClick={() => setTab("delete")} disabled={tab === "delete"}>
          Delete Task
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {tab === "create" && (
            <Task type="create" refreshTasks={() => setTab("list")} />
          )}
          {tab === "list" && <Task type="list" tasks={tasks} />}
          {tab === "update" && (
            <Task
              type="update"
              tasks={tasks}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              refreshTasks={() => setTab("list")}
            />
          )}
          {tab === "delete" && (
            <Task
              type="delete"
              tasks={tasks}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              refreshTasks={() => setTab("list")}
            />
          )}
        </>
      )}
    </div>
  );
}
