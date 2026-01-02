import api from './api';

const couponApi = {
  list: async () => {
    const res = await api.get('/coupons');
    return res?.data || [];
  },
  create: async (coupon) => {
    const res = await api.post('/coupons', coupon);
    return res?.data;
  },
  update: async (id, coupon) => {
    const res = await api.put(`/coupons/${id}`, coupon);
    return res?.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/coupons/${id}`);
    return res?.data;
  },
  validate: async ({ code, subtotal, petType, category, subcategory, email }) => {
    try {
      const payload = { code, subtotal, petType, category, subcategory };
      if (email) payload.email = email;
      const res = await api.post('/coupons/validate', payload);
      return { valid: true, ...res?.data };
    } catch (err) {
      const reason = err?.response?.data?.reason || 'Invalid coupon';
      return { valid: false, reason };
    }
  }
  ,
  apply: async ({ code, subtotal, petType, category, subcategory, email, userId }) => {
    try {
      const payload = { code, subtotal, petType, category, subcategory };
      if (email) payload.email = email;
      if (userId) payload.userId = userId;
      const res = await api.post('/coupons/apply', payload);
      return { valid: true, ...res?.data };
    } catch (err) {
      const reason = err?.response?.data?.reason || 'Failed to apply coupon';
      return { valid: false, reason };
    }
  }
};

export default couponApi;
