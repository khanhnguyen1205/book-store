/**
 * Tiện ích tính tuổi cho tính năng giới hạn độ tuổi mua sách.
 * Ngày sinh lưu dạng chuỗi ISO "YYYY-MM-DD".
 */

/** Tuổi (số năm tròn) từ ngày sinh. Trả về null nếu DOB không hợp lệ. */
export function getAge(dateOfBirth, now = new Date()) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;

  let age = now.getFullYear() - dob.getFullYear();
  // Trừ 1 nếu chưa tới sinh nhật trong năm nay.
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * User có đủ tuổi cho sách yêu cầu minAge không.
 *  - minAge rỗng/0  -> không giới hạn, luôn true.
 *  - user chưa biết DOB -> coi như đủ tuổi (tài khoản cũ trước khi có DOB).
 */
export function meetsAgeRequirement(user, minAge) {
  if (!minAge || minAge <= 0) return true;
  const age = getAge(user?.dateOfBirth);
  if (age === null) return true;
  return age >= minAge;
}
