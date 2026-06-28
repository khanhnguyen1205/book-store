/**
 * Client-side session manager — mô phỏng cơ chế session token của web hiện đại
 * trên nền JSON Server (backend mock không cấp được cookie httpOnly / JWT thật).
 *
 * Mô hình:
 *  - Remember me  -> lưu localStorage, sống tối đa TTL_REMEMBER (7 ngày).
 *  - Không remember -> lưu sessionStorage (tự mất khi đóng tab), sống tối đa TTL.
 *  - Mọi phiên đều bị tự đăng xuất nếu không hoạt động quá IDLE_TIMEOUT.
 *
 * Lưu ý bảo mật: KHÔNG bao giờ lưu password vào storage (xem stripUser).
 */

const SESSION_KEY = 'session';

// Thời lượng (mili-giây)
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const IDLE_TIMEOUT = 30 * MINUTE; // tự đăng xuất sau 30' không thao tác
const TTL = 24 * HOUR;                    // phiên thường: 24 giờ
const TTL_REMEMBER = 7 * DAY;             // có "remember me": 7 ngày

/** Loại bỏ password (và mọi trường nhạy cảm) trước khi lưu xuống storage. */
function stripUser(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

/** Chọn storage theo chế độ remember; dọn luôn storage còn lại để tránh phiên "ma". */
function pickStorage(rememberMe) {
  return rememberMe ? window.localStorage : window.sessionStorage;
}

/**
 * Tạo và lưu một phiên mới sau khi đăng nhập thành công.
 * Trả về user "sạch" (đã bỏ password) để set vào state.
 */
export function saveSession(user, rememberMe = false) {
  const now = Date.now();
  const safeUser = stripUser(user);
  const session = {
    user: safeUser,
    rememberMe,
    createdAt: now,
    lastActiveAt: now,
    expiresAt: now + (rememberMe ? TTL_REMEMBER : TTL),
  };

  // Xoá ở cả hai nơi rồi mới ghi đúng chỗ -> không để sót phiên cũ.
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
  pickStorage(rememberMe).setItem(SESSION_KEY, JSON.stringify(session));

  return safeUser;
}

/** Đọc raw session từ bất kỳ storage nào đang giữ nó. */
function readRaw() {
  const stored =
    window.sessionStorage.getItem(SESSION_KEY) ||
    window.localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Đọc phiên hợp lệ. Nếu hết hạn TTL hoặc quá idle -> xoá và trả null.
 * Đây là chốt chặn khiến web KHÔNG còn tự đăng nhập vô thời hạn.
 */
export function loadSession() {
  const session = readRaw();
  if (!session || !session.user) return null;

  const now = Date.now();
  const expiredByTtl = now >= session.expiresAt;
  const expiredByIdle = now - session.lastActiveAt >= IDLE_TIMEOUT;

  if (expiredByTtl || expiredByIdle) {
    clearSession();
    return null;
  }
  return session.user;
}

/**
 * Cập nhật mốc hoạt động gần nhất (gọi khi user thao tác).
 * Có throttle: chỉ ghi lại nếu đã hơn 30s kể từ lần ghi trước, tránh ghi storage liên tục.
 */
export function touchSession() {
  const session = readRaw();
  if (!session) return;

  const now = Date.now();
  if (now - session.lastActiveAt < 30 * 1000) return;

  session.lastActiveAt = now;
  pickStorage(session.rememberMe).setItem(SESSION_KEY, JSON.stringify(session));
}

/** Ghi đè thông tin user trong phiên (vd sau khi cập nhật profile). */
export function updateSessionUser(partial) {
  const session = readRaw();
  if (!session) return null;

  session.user = stripUser({ ...session.user, ...partial });
  pickStorage(session.rememberMe).setItem(SESSION_KEY, JSON.stringify(session));
  return session.user;
}

/** Xoá sạch phiên ở cả hai storage. */
export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}
