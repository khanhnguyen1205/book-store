/**
 * Shared validation helpers cho form Đăng nhập / Đăng ký.
 * Mỗi hàm trả về chuỗi lỗi ("" nghĩa là hợp lệ) để component hiển thị.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Email: bắt buộc + đúng định dạng. */
export function validateEmail(email) {
  const value = email.trim();
  if (!value) return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Invalid email format";
  return "";
}

/** Họ tên: bắt buộc + tối thiểu 2 ký tự. */
export function validateFullName(name) {
  const value = name.trim();
  if (!value) return "Full Name is required";
  if (value.length < 2) return "Full Name is too short";
  return "";
}

/**
 * Mật khẩu khi ĐĂNG KÝ: tối thiểu 8 ký tự, có cả chữ và số.
 * (Login KHÔNG dùng hàm này vì tài khoản cũ có thể đặt mật khẩu yếu.)
 */
export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Minimum 8 characters";
  if (!/[a-zA-Z]/.test(password)) return "Must contain a letter";
  if (!/[0-9]/.test(password)) return "Must contain a number";
  return "";
}

/** Mật khẩu khi ĐĂNG NHẬP: chỉ cần không bỏ trống. */
export function validateLoginPassword(password) {
  if (!password) return "Password is required";
  return "";
}

/** Xác nhận mật khẩu: bắt buộc + khớp với mật khẩu. */
export function validateConfirm(password, confirm) {
  if (!confirm) return "Confirmation is required";
  if (confirm !== password) return "Passwords do not match";
  return "";
}

/**
 * Độ mạnh mật khẩu, trả về điểm 0..4 dùng cho thanh hiển thị.
 * +1 đủ dài, +1 có cả hoa/thường, +1 có số, +1 có ký tự đặc biệt.
 */
export function passwordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return score;
}

export const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
export const STRENGTH_COLORS = ["#e8e8ee", "#e24b4a", "#e2a23b", "#3bb273", "#1f9d57"];
