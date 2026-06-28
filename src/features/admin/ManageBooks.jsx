import React, { useEffect, useState } from 'react';
import { adminService } from './adminService';
import { formatPrice } from '../cart/cartUtils';
import './Admin.css';

const EMPTY_BOOK = {
  title: '',
  author: '',
  category: '',
  price: '',
  stock: '',
  age: '',
  image: '',
  description: '',
};

/** Giá trị mặc định cho các trường không nhập trong form khi tạo sách mới. */
const CREATE_DEFAULTS = { sold: 0, rating: 0, reviews: 0, bg: '#f0e6d3' };

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null = đóng; {} hoặc book = mở

  const loadBooks = async () => {
    setLoading(true);
    setError('');
    try {
      setBooks(await adminService.getBooks());
    } catch {
      setError('Không tải được danh sách sách. Kiểm tra JSON Server (cổng 9999).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (book) => {
    if (!window.confirm(`Xoá sách "${book.title}"?`)) return;
    try {
      await adminService.deleteBook(book.id);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
    } catch {
      setError('Xoá sách thất bại.');
    }
  };

  const handleSaved = (saved, isEdit) => {
    setBooks((prev) =>
      isEdit ? prev.map((b) => (b.id === saved.id ? saved : b)) : [...prev, saved]
    );
    setEditing(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Quản lý sách</h1>
          <p className="admin-subtitle">{books.length} đầu sách</p>
        </div>
        <button className="admin-btn primary" onClick={() => setEditing({ ...EMPTY_BOOK })}>
          + Thêm sách
        </button>
      </div>

      {error && <p className="admin-feedback error">{error}</p>}

      {loading ? (
        <p className="admin-empty">Đang tải…</p>
      ) : books.length === 0 ? (
        <p className="admin-empty">Chưa có sách nào.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bìa</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Thể loại</th>
                <th>Giá</th>
                <th>Tồn</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <img
                      className="cover-thumb"
                      src={book.image}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden';
                      }}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{formatPrice(book.price)}</td>
                  <td>{book.stock}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="admin-btn ghost sm" onClick={() => setEditing(book)}>
                        Sửa
                      </button>
                      <button className="admin-btn danger sm" onClick={() => handleDelete(book)}>
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <BookFormModal
          book={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

/** Modal thêm/sửa sách. `book.id` tồn tại => chế độ sửa. */
function BookFormModal({ book, onClose, onSaved }) {
  const isEdit = Boolean(book.id);
  const [form, setForm] = useState({
    title: book.title || '',
    author: book.author || '',
    category: book.category || '',
    price: book.price ?? '',
    stock: book.stock ?? '',
    age: book.age ?? '',
    image: book.image || '',
    description: book.description || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Bắt buộc';
    if (!form.author.trim()) next.author = 'Bắt buộc';
    if (form.price === '' || Number(form.price) < 0) next.price = 'Giá không hợp lệ';
    if (form.stock === '' || Number(form.stock) < 0) next.stock = 'Tồn kho không hợp lệ';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      age: form.age === '' ? 0 : Number(form.age),
      image: form.image.trim(),
      description: form.description.trim(),
    };

    setSaving(true);
    try {
      let saved;
      if (isEdit) {
        // Giữ nguyên các trường không nằm trong form (sold, rating, reviews, bg…).
        saved = await adminService.updateBook(book.id, { ...book, ...payload });
      } else {
        saved = await adminService.createBook({ ...CREATE_DEFAULTS, ...payload });
      }
      onSaved(saved, isEdit);
    } catch {
      setSubmitError('Lưu thất bại. Kiểm tra JSON Server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onMouseDown={onClose}>
      <div className="admin-modal" onMouseDown={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Sửa sách' : 'Thêm sách'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-field full">
              <label>Tên sách</label>
              <input value={form.title} onChange={setField('title')} />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>
            <div className="admin-field">
              <label>Tác giả</label>
              <input value={form.author} onChange={setField('author')} />
              {errors.author && <span className="field-error">{errors.author}</span>}
            </div>
            <div className="admin-field">
              <label>Thể loại</label>
              <input value={form.category} onChange={setField('category')} />
            </div>
            <div className="admin-field">
              <label>Giá (vd 34990)</label>
              <input type="number" value={form.price} onChange={setField('price')} />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
            <div className="admin-field">
              <label>Tồn kho</label>
              <input type="number" value={form.stock} onChange={setField('stock')} />
              {errors.stock && <span className="field-error">{errors.stock}</span>}
            </div>
            <div className="admin-field">
              <label>Độ tuổi (age)</label>
              <input type="number" value={form.age} onChange={setField('age')} />
            </div>
            <div className="admin-field full">
              <label>URL ảnh bìa</label>
              <input value={form.image} onChange={setField('image')} />
            </div>
            <div className="admin-field full">
              <label>Mô tả</label>
              <textarea value={form.description} onChange={setField('description')} />
            </div>
          </div>

          {submitError && <p className="admin-feedback error">{submitError}</p>}

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn ghost" onClick={onClose} disabled={saving}>
              Huỷ
            </button>
            <button type="submit" className="admin-btn primary" disabled={saving}>
              {saving ? 'Đang lưu…' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
