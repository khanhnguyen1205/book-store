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
  .ca-page {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at top left, rgba(198, 161, 91, 0.10), transparent 45%),
      radial-gradient(ellipse at bottom right, rgba(198, 161, 91, 0.06), transparent 50%),
      var(--wall);
    display: flex;
    flex-direction: column;
    font-family: var(--font-ui);
    color: var(--paper);
  }

  .ca-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }

  .ca-card {
    background: var(--wall-2);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 3rem 3.5rem;
    width: 100%;
    max-width: 480px;
    box-shadow: var(--shadow-lift);
  }

  .ca-brand-link {
    display: block;
    text-decoration: none;
    transition: opacity 0.15s ease;
  }
  .ca-brand-link:hover { opacity: 0.75; }

  .ca-brand {
    text-align: center;
    font-family: var(--font-display);
    font-size: 22px;
    font-style: italic;
    color: var(--brass-bright);
    margin-bottom: 0.75rem;
    font-weight: 500;
  }

  .ca-heading {
    text-align: center;
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 500;
    color: var(--paper);
    margin-bottom: 0.5rem;
    letter-spacing: -0.3px;
  }

  .ca-subheading {
    text-align: center;
    font-size: 14px;
    color: var(--paper-mute);
    margin-bottom: 2.25rem;
  }

  .ca-form { display: flex; flex-direction: column; gap: 0; }

  .ca-field { margin-bottom: 1.5rem; }

  .ca-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--paper-mute);
    font-weight: 600;
    margin-bottom: 8px;
    display: block;
  }

  .ca-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--line);
    padding-bottom: 10px;
    transition: border-color 0.2s ease;
  }
  .ca-input-row:focus-within { border-bottom-color: var(--brass); }

  .ca-input-row svg { flex-shrink: 0; color: var(--paper-mute); }
  /* Icon dùng stroke literal -> ép theo palette */
  .ca-input-row svg circle,
  .ca-input-row svg path,
  .ca-input-row svg rect { stroke: var(--paper-mute); }

  .ca-input-row input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    font-size: 14px;
    color: var(--paper);
    background: transparent;
    font-family: var(--font-ui);
  }

  .ca-input-row input::placeholder { color: var(--paper-mute); }

  .ca-eye {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--paper-mute);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .ca-eye:hover { color: var(--brass-bright); }

  .ca-error { color: var(--error); font-size: 12px; margin-top: 4px; }

  /* Ngày sinh: 3 ô chọn Day / Month / Year */
  .ca-dob-grid { display: grid; grid-template-columns: 0.8fr 1.3fr 1fr; gap: 12px; }
  .ca-dob-select {
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--line);
    background: transparent;
    padding: 2px 18px 10px 0;
    font-size: 14px;
    color: var(--paper);
    font-family: var(--font-ui);
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23AEB6AB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0 center;
    background-size: 12px;
  }
  .ca-dob-select option { background: var(--wall-2); color: var(--paper); }
  .ca-dob-select:focus { border-bottom-color: var(--brass); }
  .ca-dob-empty { color: var(--paper-mute); }

  /* Thanh hiển thị độ mạnh mật khẩu */
  .ca-strength { margin: -0.5rem 0 1.5rem; }
  .ca-strength-bars { display: flex; gap: 6px; }
  .ca-strength-seg {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: var(--line);
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
    color: var(--paper-mute);
    letter-spacing: 3px;
    line-height: 1;
  }

  .ca-divider {
    height: 1px;
    background: var(--line-soft);
    margin: 0.5rem 0 1.75rem;
  }

  .ca-btn-create {
    width: 100%;
    background: var(--brass);
    color: var(--wall);
    border: none;
    border-radius: 30px;
    padding: 16px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.02em;
    margin-bottom: 1.25rem;
    transition: background 0.18s ease, transform 0.12s ease;
  }
  .ca-btn-create:hover:not(:disabled) { background: var(--brass-bright); transform: translateY(-1px); }

  .ca-signin-row {
    text-align: center;
    font-size: 13px;
    color: var(--paper-mute);
  }

  .ca-signin-row a {
    color: var(--brass-bright);
    text-decoration: none;
    font-weight: 600;
  }

  /* Footer */
  .ca-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--line-soft);
  }

  .ca-footer-brand {
    font-family: var(--font-display);
    font-size: 15px;
    color: var(--paper-dim);
    font-style: italic;
  }

  .ca-footer-copy {
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--paper-mute);
    text-transform: uppercase;
  }

  .ca-footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .ca-footer-links span {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--paper-mute);
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 500;
  }
  .ca-footer-links span:hover { color: var(--brass-bright); }
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

// Ngày sinh nhập bằng 3 ô chọn Day / Month / Year (chuẩn UX của FB, Google, PayPal...)
// — không phải lội lịch về quá khứ, đồng nhất mọi trình duyệt.
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const CURRENT_YEAR = new Date().getFullYear();
const DOB_YEARS = Array.from({ length: 120 }, (_, i) => CURRENT_YEAR - i);

/** Số ngày của tháng (1-12) trong năm đã chọn; mặc định 31 khi chưa đủ dữ liệu. */
const daysInMonth = (month, year) =>
    month ? new Date(Number(year) || 2000, Number(month), 0).getDate() : 31;

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
    const [dob, setDob] = useState({ day: "", month: "", year: "" });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Ghép 3 ô chọn thành ISO "YYYY-MM-DD" (rỗng nếu chưa chọn đủ).
    const dateOfBirth =
        dob.day && dob.month && dob.year
            ? `${dob.year}-${String(dob.month).padStart(2, "0")}-${String(dob.day).padStart(2, "0")}`
            : "";

    // Đổi 1 phần của ngày sinh; nếu ngày vượt quá số ngày của tháng/năm mới thì bỏ chọn ngày.
    const changeDob = (field) => (e) => {
        const value = e.target.value;
        setDob((prev) => {
            const next = { ...prev, [field]: value };
            if (next.day && Number(next.day) > daysInMonth(next.month, next.year)) {
                next.day = "";
            }
            return next;
        });
    };

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
                    <Link to="/" className="ca-brand-link" title="Back to store">
                        <div className="ca-brand">The Literary Gallery</div>
                    </Link>
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

                        {/* Date of Birth — 3 ô chọn; dùng để kiểm tra giới hạn độ tuổi khi mua sách */}
                        <div className="ca-field">
                            <label className="ca-label">Date of Birth</label>
                            <div className="ca-dob-grid">
                                <select
                                    className={`ca-dob-select${dob.day ? "" : " ca-dob-empty"}`}
                                    value={dob.day}
                                    onChange={changeDob("day")}
                                    onBlur={() => markTouched("dateOfBirth")}
                                    aria-label="Day of birth"
                                >
                                    <option value="" disabled>Day</option>
                                    {Array.from({ length: daysInMonth(dob.month, dob.year) }, (_, i) => i + 1).map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <select
                                    className={`ca-dob-select${dob.month ? "" : " ca-dob-empty"}`}
                                    value={dob.month}
                                    onChange={changeDob("month")}
                                    onBlur={() => markTouched("dateOfBirth")}
                                    aria-label="Month of birth"
                                >
                                    <option value="" disabled>Month</option>
                                    {MONTHS.map((name, i) => (
                                        <option key={name} value={i + 1}>{name}</option>
                                    ))}
                                </select>
                                <select
                                    className={`ca-dob-select${dob.year ? "" : " ca-dob-empty"}`}
                                    value={dob.year}
                                    onChange={changeDob("year")}
                                    onBlur={() => markTouched("dateOfBirth")}
                                    aria-label="Year of birth"
                                >
                                    <option value="" disabled>Year</option>
                                    {DOB_YEARS.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
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
                                            style={{ background: seg <= strength ? STRENGTH_COLORS[strength] : "var(--line)" }}
                                        />
                                    ))}
                                </div>
                                <div className="ca-strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                                    {STRENGTH_LABELS[strength]}
                                </div>
                            </div>
                        )}

                        <div className="ca-divider" />

                        {generalError && <div style={{ color: "var(--error)", fontSize: "14px", marginBottom: "1rem", textAlign: "center" }}>{generalError}</div>}
                        {successMsg && <div style={{ color: "var(--success)", fontSize: "14px", marginBottom: "1rem", textAlign: "center" }}>{successMsg}</div>}

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