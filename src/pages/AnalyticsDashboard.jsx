import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/analytics_dashboard.css"; 
import { useNavigate } from "react-router-dom";
import TaskStatusChart from "../components/TaskStatusChart";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/analytics/analytics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Analytics data:", res.data);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  if (loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>No analytics data available.</p>;

  // Calculate maximum for scaling bars
  const maxCount = Math.max(analytics.total || 0, 1);

  const renderBar = (label, count, color) => {
    const widthPercent = (count / maxCount) * 100;
    return (
      <div className="bar-container">
        <span className="bar-label">{label}</span>
        <div className="bar-bg">
          <div className="bar-fill" style={{ width: `${widthPercent}%`, backgroundColor: color }}></div>
        </div>
        <span className="bar-count">{count}</span>
      </div>
    );
  };

  return (
    
    <div className="analytics-container">
      <h2>Admin Analytics Dashboard</h2>
       <div className="chart-wrapper">
        <TaskStatusChart analytics={analytics} />
      </div>

      <p className="timestamp">
        Last updated: {new Date(analytics.current_time).toLocaleString()}
      </p>
    </div>
  );
};


export default AnalyticsDashboard;
