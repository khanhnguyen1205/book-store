import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "./authService";
import { useAuth } from "./AuthContext";
import { validateEmail, validateLoginPassword } from "./validation";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lỗi từng ô được tính lại mỗi lần render.
  const errors = {
    email: validateEmail(email),
    password: validateLoginPassword(password),
  };
  const isFormValid = !Object.values(errors).some(Boolean);

  const showError = (field) => (touched[field] ? errors[field] : "");
  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Lộ mọi lỗi còn lại khi bấm submit.
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    setLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const user = await authService.login(normalizedEmail, password);
      if (user) {
        login(user, rememberMe);
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background watermark text */}
      <span className="watermark watermark-top-right">Atelier</span>
      <span className="watermark watermark-bottom-left">Libertas</span>

      {/* Main content wrapper */}
      <div className="login-wrapper">
        {/* Header */}
        <header className="login-header">
          <Link to="/" className="login-brand-link" title="Back to store">
            <h1 className="login-brand">The Literary Gallery</h1>
          </Link>
          <p className="login-subtitle">WELCOME BACK TO THE ATELIER</p>
        </header>

        {/* Form Card */}
        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="curator@literarygallery.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                required
              />
              {showError("email") && (
                <p style={{ color: "#e24b4a", fontSize: "0.78rem", margin: "6px 0 0" }}>
                  {showError("email")}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                PASSWORD
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => markTouched("password")}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              {showError("password") && (
                <p style={{ color: "#e24b4a", fontSize: "0.78rem", margin: "6px 0 0" }}>
                  {showError("password")}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="remember-label">Remember me</span>
              </label>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            {/* Error message */}
            {error && (
              <p style={{ color: "#e24b4a", fontSize: "0.82rem", margin: "-6px 0 0" }}>
                {error}
              </p>
            )}

            {/* Sign In Button */}
            <button type="submit" className="btn-signin" disabled={loading || !isFormValid}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <div className="login-footer">
            <p className="register-text">
              New to the collection?{" "}
              <Link to="/register" className="register-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Icon Bar */}
        <nav className="bottom-icons" aria-label="Support options">
          {/* Help Icon */}
          <button type="button" className="icon-btn" aria-label="Help">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          {/* Search / Accessibility Icon */}
          <button type="button" className="icon-btn" aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Language / Translate Icon */}
          <button type="button" className="icon-btn" aria-label="Change language">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 8l6 6" />
              <path d="M4 14l6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="M22 22l-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Login;
