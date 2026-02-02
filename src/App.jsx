import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginRegister from "./pages/LoginRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/dashboard"element={<ProtectedRoute>
          
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected analytics route (only admin can access) */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute adminOnly={true}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
