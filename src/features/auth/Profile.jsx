import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import { useAuth } from "./AuthContext";
import { validateEmail } from "./validation";
import "./Profile.css";

/** Builds up to two uppercase initials from a name, falling back to the email. */
function getInitials(name, email) {
  const source = (name || "").trim();
  if (!source) return (email || "?").charAt(0).toUpperCase();
  const parts = source.split(/\s+/);
  const first = parts[0]?.charAt(0) || "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Profile info form (display name + email)
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [infoErrors, setInfoErrors] = useState({});
  const [infoMsg, setInfoMsg] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoMsg("");

    const errors = {};
    const trimmedName = fullName.trim();
    const normalizedEmail = email.toLowerCase().trim();

    const emailError = validateEmail(normalizedEmail);
    if (!trimmedName) errors.fullName = "Display name is required";
    if (emailError) errors.email = emailError;

    setInfoErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Nothing changed
    if (trimmedName === user.fullName && normalizedEmail === user.email) {
      setInfoMsg("No changes to save.");
      return;
    }

    setInfoSaving(true);
    try {
      if (normalizedEmail !== user.email) {
        const taken = await authService.isEmailTaken(normalizedEmail, user.id);
        if (taken) {
          setInfoErrors({ email: "Email already in use" });
          setInfoSaving(false);
          return;
        }
      }

      const saved = await authService.updateProfile(user.id, {
        fullName: trimmedName,
        email: normalizedEmail,
      });
      updateUser({ fullName: saved.fullName, email: saved.email });
      setInfoMsg("Profile updated successfully.");
    } catch (err) {
      setInfoErrors({ general: "Unable to save changes. Please try again." });
    } finally {
      setInfoSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMsg("");

    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    else if (newPassword.length < 6) errors.newPassword = "Minimum 6 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your new password";
    else if (confirmPassword !== newPassword) errors.confirmPassword = "Passwords do not match";

    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPwSaving(true);
    try {
      const valid = await authService.verifyPassword(user.id, currentPassword);
      if (!valid) {
        setPwErrors({ currentPassword: "Current password is incorrect" });
        setPwSaving(false);
        return;
      }

      await authService.updateProfile(user.id, { password: newPassword });
      updateUser({ password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwMsg("Password changed successfully.");
    } catch (err) {
      setPwErrors({ general: "Unable to change password. Please try again." });
    } finally {
      setPwSaving(false);
    }
  };

  const initials = getInitials(user?.fullName, user?.email);

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <button type="button" className="profile-back" onClick={() => navigate("/")}>
          ← Back to store
        </button>

        {/* Banner + avatar header */}
        <header className="profile-hero">
          <div className="profile-hero-banner" />
          <div className="profile-hero-body">
            <div className="profile-avatar" aria-hidden="true">{initials}</div>
            <h1 className="profile-name">{user?.fullName || "Your account"}</h1>
            <p className="profile-email">{user?.email}</p>
            {user?.role && (
              <span className={`profile-badge profile-badge-${user.role}`}>{user.role}</span>
            )}
          </div>
        </header>

        {/* Account information */}
        <section className="profile-card">
          <div className="profile-card-head">
            <h2 className="profile-card-title">Account Information</h2>
            <p className="profile-card-desc">Update your display name and the email linked to your account.</p>
          </div>
          <form className="profile-form" onSubmit={handleInfoSubmit}>
            <div className="profile-grid">
              <div className="profile-group">
                <label htmlFor="fullName" className="profile-label">DISPLAY NAME</label>
                <input
                  id="fullName"
                  type="text"
                  className="profile-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {infoErrors.fullName && <p className="profile-error">{infoErrors.fullName}</p>}
              </div>

              <div className="profile-group">
                <label htmlFor="email" className="profile-label">EMAIL ADDRESS</label>
                <input
                  id="email"
                  type="email"
                  className="profile-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {infoErrors.email && <p className="profile-error">{infoErrors.email}</p>}
              </div>
            </div>

            <div className="profile-form-footer">
              <div className="profile-feedback">
                {infoErrors.general && <p className="profile-error">{infoErrors.general}</p>}
                {infoMsg && <p className="profile-success">{infoMsg}</p>}
              </div>
              <button type="submit" className="profile-btn" disabled={infoSaving}>
                {infoSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Change password */}
        <section className="profile-card">
          <div className="profile-card-head">
            <h2 className="profile-card-title">Change Password</h2>
            <p className="profile-card-desc">For your security, enter your current password to set a new one.</p>
          </div>
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <div className="profile-group">
              <label htmlFor="currentPassword" className="profile-label">CURRENT PASSWORD</label>
              <input
                id="currentPassword"
                type="password"
                className="profile-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {pwErrors.currentPassword && <p className="profile-error">{pwErrors.currentPassword}</p>}
            </div>

            <div className="profile-grid">
              <div className="profile-group">
                <label htmlFor="newPassword" className="profile-label">NEW PASSWORD</label>
                <input
                  id="newPassword"
                  type="password"
                  className="profile-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {pwErrors.newPassword && <p className="profile-error">{pwErrors.newPassword}</p>}
              </div>

              <div className="profile-group">
                <label htmlFor="confirmPassword" className="profile-label">CONFIRM NEW PASSWORD</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="profile-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {pwErrors.confirmPassword && <p className="profile-error">{pwErrors.confirmPassword}</p>}
              </div>
            </div>

            <div className="profile-form-footer">
              <div className="profile-feedback">
                {pwErrors.general && <p className="profile-error">{pwErrors.general}</p>}
                {pwMsg && <p className="profile-success">{pwMsg}</p>}
              </div>
              <button type="submit" className="profile-btn" disabled={pwSaving}>
                {pwSaving ? "Saving..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
