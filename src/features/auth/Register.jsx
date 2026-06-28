import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ca-page {
    min-height: 100vh;
    background: radial-gradient(ellipse at top left, #e8e4f8 0%, #f5f4fc 40%, #ece8f8 70%, #e4e0f5 100%);
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
  }

  .ca-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }

  .ca-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 3rem 3.5rem;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 4px 40px rgba(80, 60, 180, 0.07);
  }

  .ca-brand {
    text-align: center;
    font-family: Georgia, serif;
    font-size: 22px;
    font-style: italic;
    color: #3333cc;
    margin-bottom: 0.75rem;
    font-weight: 500;
  }

  .ca-heading {
    text-align: center;
    font-family: Georgia, serif;
    font-size: 30px;
    font-weight: 400;
    color: #111;
    margin-bottom: 0.5rem;
    letter-spacing: -0.3px;
  }

  .ca-subheading {
    text-align: center;
    font-size: 14px;
    color: #aaa;
    margin-bottom: 2.25rem;
  }

  .ca-form { display: flex; flex-direction: column; gap: 0; }

  .ca-field { margin-bottom: 1.5rem; }

  .ca-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #aaa;
    font-weight: 600;
    margin-bottom: 8px;
    display: block;
  }

  .ca-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #e8e8ee;
    padding-bottom: 10px;
  }

  .ca-input-row svg { flex-shrink: 0; color: #bbb; }

  .ca-input-row input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333;
    background: transparent;
    font-family: sans-serif;
  }

  .ca-input-row input::placeholder { color: #bbb; }

  .ca-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .ca-dots {
    font-size: 18px;
    color: #bbb;
    letter-spacing: 3px;
    line-height: 1;
  }

  .ca-divider {
    height: 1px;
    background: #f0f0f5;
    margin: 0.5rem 0 1.75rem;
  }

  .ca-btn-create {
    width: 100%;
    background: #3333cc;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 16px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.02em;
    margin-bottom: 1.25rem;
  }

  .ca-signin-row {
    text-align: center;
    font-size: 13px;
    color: #999;
  }

  .ca-signin-row a {
    color: #3333cc;
    text-decoration: none;
    font-weight: 500;
  }

  /* Footer */
  .ca-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
  }

  .ca-footer-brand {
    font-family: Georgia, serif;
    font-size: 15px;
    color: #333;
    font-style: italic;
  }

  .ca-footer-copy {
    font-size: 11px;
    letter-spacing: 0.06em;
    color: #bbb;
    text-transform: uppercase;
  }

  .ca-footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .ca-footer-links span {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #aaa;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 500;
  }
`;

const IconUser = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="#bbb" strokeWidth="1.3" />
        <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const IconAt = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" stroke="#bbb" strokeWidth="1.3" />
        <path d="M11 8c0 2.2.9 3 2 3s2-1.3 2-3a7 7 0 1 0-2 4.9" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#bbb" strokeWidth="1.3" />
        <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

export default function CreateAccount() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Minimum 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirmation is required";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrors({});

        if (!validate()) return;

        setLoading(true);
        try {
            const normalizedEmail = email.toLowerCase().trim();

            // Check if email exists
            const { data: existingAccounts } = await api.get(`/users?email=${normalizedEmail}`);
            
            if (existingAccounts.length > 0) {
                setErrors({ email: "Email already exists" });
                setLoading(false);
                return;
            }

            // Create new account
            await api.post('/users', {
                fullName: fullName.trim(),
                email: normalizedEmail,
                password,
                role: "user"
            });

            setSuccessMsg("Account created successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            
        } catch (err) {
            // Lấy thông báo lỗi chi tiết từ server (nếu có) hoặc dùng thông báo mặc định của lỗi
            const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
            setErrors({ general: `Registration failed: ${errorMessage}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ca-page">
            <style>{styles}</style>

            <main className="ca-main">
                <div className="ca-card">
                    <div className="ca-brand">The Literary Gallery</div>
                    <h1 className="ca-heading">Create Account</h1>
                    <p className="ca-subheading">Welcome to our digital atelier.</p>

                    <form className="ca-form" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="ca-field">
                            <label className="ca-label">Full Name</label>
                            <div className="ca-input-row">
                                <IconUser />
                                <input 
                                    type="text" 
                                    placeholder="Julian Thorne" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            {errors.fullName && <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "4px" }}>{errors.fullName}</div>}
                        </div>

                        {/* Email Address */}
                        <div className="ca-field">
                            <label className="ca-label">Email Address</label>
                            <div className="ca-input-row">
                                <IconAt />
                                <input 
                                    type="email" 
                                    placeholder="julian@atelier.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {errors.email && <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "4px" }}>{errors.email}</div>}
                        </div>

                        {/* Password + Confirm Password */}
                        <div className="ca-two-col">
                            <div className="ca-field" style={{ marginBottom: 0 }}>
                                <label className="ca-label">Password</label>
                                <div className="ca-input-row">
                                    <IconLock />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {errors.password && <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "4px" }}>{errors.password}</div>}
                            </div>
                            <div className="ca-field" style={{ marginBottom: 0 }}>
                                <label className="ca-label">Confirm Password</label>
                                <div className="ca-input-row">
                                    <IconLock />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                {errors.confirmPassword && <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "4px" }}>{errors.confirmPassword}</div>}
                            </div>
                        </div>

                        <div className="ca-divider" />

                        {errors.general && <div style={{ color: "#e24b4a", fontSize: "14px", marginBottom: "1rem", textAlign: "center" }}>{errors.general}</div>}
                        {successMsg && <div style={{ color: "#28a745", fontSize: "14px", marginBottom: "1rem", textAlign: "center" }}>{successMsg}</div>}

                        <button type="submit" className="ca-btn-create" disabled={loading}>
                            {loading ? "Creating..." : "Create Account"}
                        </button>

                        <div className="ca-signin-row">
                            Already a member? <Link to="/login">Sign In</Link>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="ca-footer">
                <div className="ca-footer-brand">The Literary Gallery</div>
                <div className="ca-footer-copy">© 2024 The Literary Gallery. All rights reserved.</div>
                <div className="ca-footer-links">
                    <span>Privacy</span>
                    <span>Terms</span>
                </div>
            </footer>
        </div>
    );
}