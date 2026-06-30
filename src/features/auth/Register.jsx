import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
    validateFullName,
    validateEmail,
    validateDateOfBirth,
    validatePassword,
    validateConfirm,
    passwordStrength,
    STRENGTH_LABELS,
    STRENGTH_COLORS,
} from "./validation";

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
    min-width: 0;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333;
    background: transparent;
    font-family: sans-serif;
  }

  .ca-input-row input::placeholder { color: #bbb; }

  .ca-eye {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #bbb;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .ca-eye:hover { color: #888; }

  .ca-error { color: #e24b4a; font-size: 12px; margin-top: 4px; }

  /* Thanh hiển thị độ mạnh mật khẩu */
  .ca-strength { margin: -0.5rem 0 1.5rem; }
  .ca-strength-bars { display: flex; gap: 6px; }
  .ca-strength-seg {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: #e8e8ee;
    transition: background 0.2s ease;
  }
  .ca-strength-label {
    font-size: 11px;
    margin-top: 6px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .ca-btn-create:disabled { opacity: 0.55; cursor: not-allowed; }

  .ca-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* Cho phép ô trong grid co lại, tránh tràn cột làm lệch nút con mắt */
  .ca-two-col > .ca-field { min-width: 0; }

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

const IconCalendar = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="#bbb" strokeWidth="1.3" />
        <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#bbb" strokeWidth="1.3" />
        <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const IconEye = ({ off }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
        {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
);

export default function CreateAccount() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Lỗi được tính lại mỗi lần render dựa trên giá trị hiện tại.
    const errors = {
        fullName: validateFullName(fullName),
        email: validateEmail(email) || (emailTaken ? "Email already exists" : ""),
        dateOfBirth: validateDateOfBirth(dateOfBirth),
        password: validatePassword(password),
        confirmPassword: validateConfirm(password, confirmPassword),
    };
    const isFormValid = !Object.values(errors).some(Boolean);
    const strength = passwordStrength(password);

    // Chỉ hiện lỗi của ô đã được "chạm" (rời ô) hoặc sau khi bấm submit.
    const showError = (field) => (touched[field] ? errors[field] : "");

    const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setGeneralError("");

        // Đánh dấu tất cả là touched để lộ mọi lỗi còn lại.
        setTouched({ fullName: true, email: true, dateOfBirth: true, password: true, confirmPassword: true });
        if (!isFormValid) return;

        setLoading(true);
        try {
            const normalizedEmail = email.toLowerCase().trim();

            // Kiểm tra email đã tồn tại chưa.
            const { data: existingAccounts } = await api.get(`/users?email=${normalizedEmail}`);

            if (existingAccounts.length > 0) {
                setEmailTaken(true);
                setLoading(false);
                return;
            }

            // Tạo tài khoản mới.
            await api.post('/users', {
                fullName: fullName.trim(),
                email: normalizedEmail,
                dateOfBirth,
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
            setGeneralError(`Registration failed: ${errorMessage}`);
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
                                    onBlur={() => markTouched("fullName")}
                                />
                            </div>
                            {showError("fullName") && <div className="ca-error">{showError("fullName")}</div>}
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
                                    onChange={(e) => { setEmail(e.target.value); setEmailTaken(false); }}
                                    onBlur={() => markTouched("email")}
                                />
                            </div>
                            {showError("email") && <div className="ca-error">{showError("email")}</div>}
                        </div>

                        {/* Date of Birth — dùng để kiểm tra giới hạn độ tuổi khi mua sách */}
                        <div className="ca-field">
                            <label className="ca-label">Date of Birth</label>
                            <div className="ca-input-row">
                                <IconCalendar />
                                <input
                                    type="date"
                                    max={new Date().toISOString().split("T")[0]}
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    onBlur={() => markTouched("dateOfBirth")}
                                />
                            </div>
                            {showError("dateOfBirth") && <div className="ca-error">{showError("dateOfBirth")}</div>}
                        </div>

                        {/* Password + Confirm Password */}
                        <div className="ca-two-col">
                            <div className="ca-field" style={{ marginBottom: 0 }}>
                                <label className="ca-label">Password</label>
                                <div className="ca-input-row">
                                    <IconLock />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => markTouched("password")}
                                    />
                                    <button type="button" className="ca-eye"
                                        aria-label="Toggle password visibility"
                                        onClick={() => setShowPassword((v) => !v)}>
                                        <IconEye off={showPassword} />
                                    </button>
                                </div>
                                {showError("password") && <div className="ca-error">{showError("password")}</div>}
                            </div>
                            <div className="ca-field" style={{ marginBottom: 0 }}>
                                <label className="ca-label">Confirm Password</label>
                                <div className="ca-input-row">
                                    <IconLock />
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={() => markTouched("confirmPassword")}
                                    />
                                    <button type="button" className="ca-eye"
                                        aria-label="Toggle confirm password visibility"
                                        onClick={() => setShowConfirm((v) => !v)}>
                                        <IconEye off={showConfirm} />
                                    </button>
                                </div>
                                {showError("confirmPassword") && <div className="ca-error">{showError("confirmPassword")}</div>}
                            </div>
                        </div>

                        {/* Thanh độ mạnh mật khẩu */}
                        {password && (
                            <div className="ca-strength">
                                <div className="ca-strength-bars">
                                    {[1, 2, 3, 4].map((seg) => (
                                        <div
                                            key={seg}
                                            className="ca-strength-seg"
                                            style={{ background: seg <= strength ? STRENGTH_COLORS[strength] : "#e8e8ee" }}
                                        />
                                    ))}
                                </div>
                                <div className="ca-strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                                    {STRENGTH_LABELS[strength]}
                                </div>
                            </div>
                        )}

                        <div className="ca-divider" />

                        {generalError && <div style={{ color: "#e24b4a", fontSize: "14px", marginBottom: "1rem", textAlign: "center" }}>{generalError}</div>}
                        {successMsg && <div style={{ color: "#28a745", fontSize: "14px", marginBottom: "1rem", textAlign: "center" }}>{successMsg}</div>}

                        <button type="submit" className="ca-btn-create" disabled={loading || !isFormValid}>
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