import api from '../../services/api';

/** Tạo đơn hàng mới. */
const createOrder = async (order) => {
  const { data } = await api.post('/orders', order);
  return data;
};

/** Lấy các đơn của một user, mới nhất trước. */
const getOrdersByUser = async (userId) => {
  const { data } = await api.get('/orders', {
    params: { userId, _sort: 'createdAt', _order: 'desc' },
  });
  return data;
};

/** Lấy chi tiết một đơn theo id. */
const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

/**
 * Giảm tồn kho từng cuốn sau khi đặt đơn thành công.
 * Đọc stock mới nhất rồi PATCH để tránh ghi đè dữ liệu cũ.
 */
const decrementStock = async (items) => {
  await Promise.all(
    items.map(async (item) => {
      try {
        const { data: book } = await api.get(`/books/${item.id}`);
        const nextStock = Math.max(0, (book.stock || 0) - item.quantity);
        await api.patch(`/books/${item.id}`, { stock: nextStock });
      } catch {
        // Bỏ qua lỗi của từng cuốn để không chặn việc tạo đơn.
      }
    })
  );
};

export const orderService = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  decrementStock,
};
