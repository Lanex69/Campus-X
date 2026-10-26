import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Power, Layers, MapPin, Search, X } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [modalService, setModalService] = useState(null); // null (closed), 'new' (create), or service obj (edit)

  const fetchServices = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.services.getServices({ page, limit: 10, isActive: undefined });
      setServices(res.services || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1);
  }, []);

  const handleToggle = async (id) => {
    try {
      const res = await api.services.toggleStatus(id);
      toast.success(res.message);
      fetchServices(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Toggle failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
            Facility Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Campus Facilities & Resources Manager
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
            Configure hourly rates, capacity thresholds, operating schedules, or deactivate services.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalService('new')}
          className="px-4 py-2 bg-[#143828] hover:bg-[#1B4D36] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Facility</span>
        </button>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#143828] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-mono">Loading service inventory...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-4 font-bold">Facility Name</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Location</th>
                  <th className="py-3 px-4 font-bold">Capacity</th>
                  <th className="py-3 px-4 font-bold">Rate</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {services.map((svc) => (
                  <tr key={svc._id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 font-bold text-stone-900">{svc.name}</td>
                    <td className="py-3 px-4 capitalize text-stone-600 font-mono text-[11px]">{svc.category}</td>
                    <td className="py-3 px-4 text-stone-500">{svc.location}</td>
                    <td className="py-3 px-4 text-stone-600 font-mono">{svc.capacity} persons</td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {svc.price === 0 ? 'Free' : `$${svc.price}`}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        svc.isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>
                        {svc.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setModalService(svc)}
                          className="p-1.5 hover:bg-stone-200 text-stone-600 rounded-md transition cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(svc._id)}
                          className={`p-1.5 rounded-md transition cursor-pointer ${
                            svc.isActive
                              ? 'text-amber-700 hover:bg-amber-50'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={svc.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-mono">
                Page {pagination.page} of {pagination.pages} ({pagination.total} items)
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchServices(pagination.page - 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchServices(pagination.page + 1)}
                  className="px-3 py-1 rounded-md border border-stone-300 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Service Modal */}
      {modalService && (
        <ServiceFormModal
          service={typeof modalService === 'object' ? modalService : null}
          onClose={() => setModalService(null)}
          onSuccess={() => {
            setModalService(null);
            fetchServices(pagination.page);
          }}
        />
      )}
    </div>
  );
}

function ServiceFormModal({ service, onClose, onSuccess }) {
  const isEdit = !!service;
  const [name, setName] = useState(service?.name || '');
  const [category, setCategory] = useState(service?.category || 'Library');
  const [description, setDescription] = useState(service?.description || '');
  const [price, setPrice] = useState(service?.price ?? 0);
  const [duration, setDuration] = useState(service?.duration || 60);
  const [capacity, setCapacity] = useState(service?.capacity || 4);
  const [location, setLocation] = useState(service?.location || '');
  const [startTime, setStartTime] = useState(service?.startTime || '08:00');
  const [endTime, setEndTime] = useState(service?.endTime || '20:00');
  const [image, setImage] = useState(service?.image || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        category,
        description,
        price: Number(price),
        duration: Number(duration),
        capacity: Number(capacity),
        location,
        startTime,
        endTime,
        image: image || undefined,
      };

      if (isEdit) {
        await api.services.updateService(service._id, payload);
        toast.success('Service updated successfully');
      } else {
        await api.services.createService(payload);
        toast.success('Service created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-stone-900 mb-4">
          {isEdit ? 'Edit Campus Facility' : 'Add New Campus Facility'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Facility Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:ring-1 focus:ring-[#143828] focus:border-[#143828]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:ring-1 focus:ring-[#143828]"
              >
                <option value="Library">Library</option>
                <option value="Computer Lab">Computer Lab</option>
                <option value="Sports">Sports</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Shuttle">Shuttle</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Rate ($) *</label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono font-medium focus:ring-1 focus:ring-[#143828]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Slot Duration (mins) *</label>
              <input
                type="number"
                min={15}
                step={15}
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono font-medium focus:ring-1 focus:ring-[#143828]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Capacity (Persons) *</label>
              <input
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono font-medium focus:ring-1 focus:ring-[#143828]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Campus Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Alan Turing Hall, Lab 204"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:ring-1 focus:ring-[#143828]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Start Time *</label>
              <input
                type="text"
                required
                placeholder="08:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono font-medium focus:ring-1 focus:ring-[#143828]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">End Time *</label>
              <input
                type="text"
                required
                placeholder="20:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono font-medium focus:ring-1 focus:ring-[#143828]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Cover Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:ring-1 focus:ring-[#143828]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:ring-1 focus:ring-[#143828]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] text-white font-bold transition shadow-xs cursor-pointer"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Facility' : 'Create Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
