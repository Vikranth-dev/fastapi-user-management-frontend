import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const navigate = useNavigate();

  // -------- Login handler --------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", loginUsername);
      formData.append("password", loginPassword);

      const response = await API.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name: response.data.username, role: response.data.role })
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        setLoginError("Invalid request. Check your username/password.");
      } else if (err.response?.status === 401) {
        setLoginError("Invalid username or password.");
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // -------- Register handler --------
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);

    // ---- Custom password validation (React) ----
    const passwordRegex = /^[A-Z][a-z]*.*[!@#$%^&*]/; 
    // First letter capital, rest lowercase, at least one special character

    if (regPassword.length < 6 || !passwordRegex.test(regPassword)) {
      setRegError(
        "Password must start with a capital letter, have lowercase letters, 1 special character, and be at least 6 characters long"
      );
      setRegLoading(false);
      return;
    }

    try {
      await API.post("/auth/register", {
        username: regUsername,
        password: regPassword,
        email: regEmail || undefined, // email optional
      });

      setRegSuccess("Registration successful! You can now log in.");
      setRegUsername("");
      setRegPassword("");
      setRegEmail("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setRegError("Username already exists.");
      } else {
        setRegError("Registration failed. Try again.");
      }
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {!isRegister ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            aria-label="Username"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
          />
          <input
            type="password"
            aria-label="Password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loginLoading} aria-label="Login">
            {loginLoading ? "Logging in..." : "Login"}
          </button>
          {loginError && <p className="auth-error">{loginError}</p>}

          <div className="auth-footer">
            Don't have an account?{" "}
            <span onClick={() => setIsRegister(true)}>Create one</span>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input
            type="text"
            aria-label="Username"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            required
          />
          <input
            type="password"
            aria-label="Password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />
       
          <input
            type="email"
            aria-label="Email (optional)"
            placeholder="Email (optional)"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
          />
          <button type="submit" disabled={regLoading} aria-label="Register">
            {regLoading ? "Registering..." : "Register"}
          </button>
          {regError && <p className="auth-error">{regError}</p>}
          {regSuccess && <p className="auth-success">{regSuccess}</p>}

          <div className="auth-footer">
            Already have an account?{" "}
            <span onClick={() => setIsRegister(false)}>Login</span>
          </div>
        </form>
      )}
    </div>
  );
}
