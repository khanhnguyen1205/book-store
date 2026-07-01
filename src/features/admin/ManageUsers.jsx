import React, { useEffect, useState } from 'react';
import { adminService } from './adminService';
import { useAuth } from '../auth/AuthContext';
import './Admin.css';

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await adminService.getUsers());
    } catch {
      setError('Không tải được danh sách người dùng. Kiểm tra JSON Server (cổng 9999).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const adminCount = users.filter((u) => u.role === 'admin').length;

  const handleRoleChange = async (target, nextRole) => {
    if (target.role === nextRole) return;
    // Không cho hạ quyền admin cuối cùng -> tránh khoá toàn bộ khu vực admin.
    if (target.role === 'admin' && nextRole !== 'admin' && adminCount <= 1) {
      setError('Không thể hạ quyền admin cuối cùng.');
      return;
    }
    setError('');
    setBusyId(target.id);
    try {
      const updated = await adminService.updateUserRole(target.id, nextRole);
      setUsers((prev) => prev.map((u) => (u.id === target.id ? updated : u)));
    } catch {
      setError('Cập nhật quyền thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (target) => {
    if (target.id === currentUser?.id) {
      setError('Không thể xoá tài khoản đang đăng nhập.');
      return;
    }
    if (target.role === 'admin' && adminCount <= 1) {
      setError('Không thể xoá admin cuối cùng.');
      return;
    }
    if (!window.confirm(`Xoá người dùng "${target.fullName || target.email}"?`)) return;
    setError('');
    setBusyId(target.id);
    try {
      await adminService.deleteUser(target.id);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
    } catch {
      setError('Xoá người dùng thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Quản lý người dùng</h1>
          <p className="admin-subtitle">{users.length} tài khoản</p>
        </div>
      </div>

      {error && <p className="admin-feedback error">{error}</p>}

      {loading ? (
        <p className="admin-empty">Đang tải…</p>
      ) : users.length === 0 ? (
        <p className="admin-empty">Chưa có người dùng nào.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Quyền</th>
                <th>Đổi quyền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      {u.fullName || '—'}
                      {isSelf && <span style={{ color: 'var(--paper-mute)' }}> (bạn)</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <select
                        className="role-select"
                        value={u.role}
                        disabled={busyId === u.id}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="admin-btn danger sm"
                        disabled={busyId === u.id || isSelf}
                        title={isSelf ? 'Không thể xoá chính mình' : 'Xoá người dùng'}
                        onClick={() => handleDelete(u)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
