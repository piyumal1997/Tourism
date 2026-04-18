import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Edit, Trash2, Plus, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const [token] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    short_desc: '',
    lat: '',
    lng: '',
    category_id: '',
    image: '',
    address: '',
    district: '',
    price_range: '₹₹',
    best_time: '',
    opening_hours: '',
    website: '',
    phone: '',
    is_featured: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [locRes, catRes] = await Promise.all([
        axios.get('/api/locations', config),
        axios.get('/api/locations/categories', config), // matches your new backend route
      ]);
      setLocations(locRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingLocation) {
        await axios.put(`/api/locations/${editingLocation.id}`, form, config);
      } else {
        await axios.post('/api/locations', form, config);
      }
      fetchData();
      setShowModal(false);
      setEditingLocation(null);
      // Reset form
      setForm({
        name: '', description: '', short_desc: '', lat: '', lng: '', category_id: '',
        image: '', address: '', district: '', price_range: '₹₹', best_time: '',
        opening_hours: '', website: '', phone: '', is_featured: false,
      });
    } catch (err) {
      alert('Error saving location');
    }
  };

  const handleEdit = (loc) => {
    setEditingLocation(loc);
    setForm({
      name: loc.name,
      description: loc.description || '',
      short_desc: loc.short_desc || '',
      lat: loc.lat,
      lng: loc.lng,
      category_id: loc.category_id,
      image: loc.image || '',
      address: loc.address || '',
      district: loc.district || '',
      price_range: loc.price_range || '₹₹',
      best_time: loc.best_time || '',
      opening_hours: loc.opening_hours || '',
      website: loc.website || '',
      phone: loc.phone || '',
      is_featured: !!loc.is_featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`/api/locations/${id}`, config);
      fetchData();
    } catch (err) {
      alert('Error deleting location');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token || !user) return null; // safety

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r shadow-sm p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl">🇱🇰</div>
          <h2 className="text-2xl font-bold tracking-tight">Sri Lanka Tourism</h2>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-medium">
            <MapPin className="w-5 h-5" />
            Locations
          </div>
        </nav>

        <div className="pt-8 border-t flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-2xl object-cover" />
          ) : (
            <div className="w-9 h-9 bg-gray-200 rounded-2xl flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{user.full_name || user.username}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-8 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Locations</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setEditingLocation(null);
                setForm({ ...form, name: '', description: '', short_desc: '', lat: '', lng: '', category_id: '' });
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Location
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </header>

        {/* Table Area */}
        <div className="flex-1 p-8 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading locations...</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-8 py-6 text-left font-medium">Location</th>
                    <th className="px-8 py-6 text-left font-medium">Category</th>
                    <th className="px-8 py-6 text-left font-medium">District</th>
                    <th className="px-8 py-6 text-center font-medium">Featured</th>
                    <th className="px-8 py-6 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((loc) => (
                    <tr key={loc.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-semibold">{loc.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{loc.short_desc}</div>
                      </td>
                      <td className="px-8 py-6 text-gray-700">{loc.category_name}</td>
                      <td className="px-8 py-6 text-gray-700">{loc.district || '-'}</td>
                      <td className="px-8 py-6 text-center text-xl">
                        {loc.is_featured ? '⭐' : '–'}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-5">
                          <button onClick={() => handleEdit(loc)} className="text-blue-600 hover:text-blue-700">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(loc.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingLocation(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input
                  placeholder="Location Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="col-span-2 p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                  required
                />

                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="District"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                />

                <input
                  type="number"
                  step="any"
                  placeholder="Latitude *"
                  value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  className="p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude *"
                  value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  className="p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                  required
                />

                <input
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="col-span-2 p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                />

                <textarea
                  placeholder="Short Description"
                  value={form.short_desc}
                  onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
                  className="col-span-2 p-4 border rounded-2xl h-24 focus:outline-none focus:border-blue-500"
                />

                <textarea
                  placeholder="Full Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="col-span-2 p-4 border rounded-2xl h-32 focus:outline-none focus:border-blue-500"
                />

                <div className="flex items-center gap-3 col-span-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Mark as Featured</label>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLocation(null);
                  }}
                  className="flex-1 py-4 border rounded-2xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
                >
                  {editingLocation ? 'Update Location' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}