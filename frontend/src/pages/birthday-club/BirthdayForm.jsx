import React, { useState, useContext } from 'react';
import serviceBookingApi from '../../services/serviceBookingApi';
import { AuthContext } from '../../contexts/AuthContext';

export default function BirthdayForm() {
  const { user } = useContext(AuthContext) || {};
  const [form, setForm] = useState({
    ownerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    petName: '',
    petType: 'DOG',
    preferredDate: '',
    preferredTime: '',
    address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.ownerName || !form.phone || !form.petName || !form.preferredDate) {
      setError('Please fill required fields: Owner name, phone, pet name and date.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const bookingData = {
        ownerName: form.ownerName,
        email: form.email,
        phone: form.phone,
        petName: form.petName,
        petType: form.petType,
        address: form.address,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        notes: form.notes,
        serviceType: 'birthday-club',
        serviceName: 'Birthday Club'
      };

      const res = await serviceBookingApi.createBooking(bookingData);
      if (res && res.success) {
        setSuccess('Thank you! Your birthday booking was received. We will contact you shortly.');
        setForm((s) => ({ ...s, petName: '', preferredDate: '', preferredTime: '', notes: '' }));
      } else {
        setError(res?.message || 'Failed to submit booking');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-3">Book Birthday Celebration</h2>
      <p className="text-sm text-muted-foreground mb-4">Celebrate your pet's special day with treats, decorations and a dedicated team to make it memorable.</p>

      {error && <div className="mb-4 text-red-700 bg-red-50 p-3 rounded">{error}</div>}
      {success && <div className="mb-4 text-green-700 bg-green-50 p-3 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm">Owner name *</span>
            <input name="ownerName" value={form.ownerName} onChange={handleChange} className="input" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Phone *</span>
            <input name="phone" value={form.phone} onChange={handleChange} className="input" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm">Email</span>
            <input name="email" value={form.email} onChange={handleChange} className="input" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Pet name *</span>
            <input name="petName" value={form.petName} onChange={handleChange} className="input" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm">Pet type</span>
            <select name="petType" value={form.petType} onChange={handleChange} className="input">
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Address</span>
            <input name="address" value={form.address} onChange={handleChange} className="input" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm">Preferred date *</span>
            <input type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} className="input" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Preferred time</span>
            <input type="time" name="preferredTime" value={form.preferredTime} onChange={handleChange} className="input" />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm">Additional details</span>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="input h-24" />
        </label>

        <div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Submitting...' : 'Book Birthday'}
          </button>
        </div>
      </form>
    </div>
  );
}
