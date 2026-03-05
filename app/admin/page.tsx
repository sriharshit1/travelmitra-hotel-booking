'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

export default function AdminPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('hotels');

    const [hotels, setHotels] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states for adding/editing hotel
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '', city: '', location: '', description: '', price: '', rating: '5', amenities: ''
    });

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/hotels');
            const data = await res.json();
            if (res.ok) setHotels(data.hotels);
        } catch (err) {
            toast.error('Failed to load hotels');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/bookings');
            const data = await res.json();
            if (res.ok) setBookings(data.bookings);
        } catch (err) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'hotels') fetchHotels();
        if (activeTab === 'bookings') fetchBookings();
    }, [activeTab]);

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setEditingHotelId(null);
        setFormData({ name: '', city: '', location: '', description: '', price: '', rating: '5', amenities: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (hotel: any) => {
        setEditingHotelId(hotel._id);
        setFormData({
            name: hotel.name,
            city: hotel.city,
            location: hotel.location || '',
            description: hotel.description,
            price: hotel.price.toString(),
            rating: hotel.rating.toString(),
            amenities: hotel.amenities?.join(', ') || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveHotel = async (e: any) => {
        e.preventDefault();
        const payload = {
            ...formData,
            price: Number(formData.price),
            rating: Number(formData.rating),
            amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
            images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'] // Mock image
        };

        try {
            const url = editingHotelId ? `/api/admin/hotels/${editingHotelId}` : '/api/admin/hotels';
            const method = editingHotelId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                setIsModalOpen(false);
                fetchHotels();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleDeleteHotel = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hotel?')) return;
        try {
            const res = await fetch(`/api/admin/hotels/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                fetchHotels();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to delete hotel');
        }
    };

    if (!user || user.role !== 'admin') return <div className="min-h-screen pt-24 text-center">Unauthorized</div>;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                            <p className="text-gray-500 mt-1">Manage hotels, bookings, and platform activity.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            <button
                                className={`py-4 px-8 font-medium text-sm transition-colors ${activeTab === 'hotels' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => setActiveTab('hotels')}
                            >
                                Hotels Management
                            </button>
                            <button
                                className={`py-4 px-8 font-medium text-sm transition-colors ${activeTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => setActiveTab('bookings')}
                            >
                                All Bookings
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8">
                            {activeTab === 'hotels' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="relative">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input type="text" placeholder="Search hotels..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 bg-gray-50" />
                                        </div>
                                        <button onClick={openAddModal} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm">
                                            <FiPlus /> <span>Add New Hotel</span>
                                        </button>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-10">Loading...</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-gray-500">
                                                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs rounded-t-xl">
                                                    <tr>
                                                        <th className="px-6 py-4">Hotel Name</th>
                                                        <th className="px-6 py-4">Location</th>
                                                        <th className="px-6 py-4">Price</th>
                                                        <th className="px-6 py-4">Rating</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {hotels.map((h: any) => (
                                                        <tr key={h._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                                                            <td className="px-6 py-4 font-medium text-gray-900">{h.name}</td>
                                                            <td className="px-6 py-4">{h.city}</td>
                                                            <td className="px-6 py-4 text-blue-600 font-medium">${h.price}</td>
                                                            <td className="px-6 py-4">{h.rating.toFixed(1)}</td>
                                                            <td className="px-6 py-4 text-right flex justify-end space-x-3">
                                                                <button onClick={() => openEditModal(h)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><FiEdit2 /></button>
                                                                <button onClick={() => handleDeleteHotel(h._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><FiTrash2 /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'bookings' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
                                    {loading ? (
                                        <div className="text-center py-10">Loading...</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-gray-500">
                                                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs">
                                                    <tr>
                                                        <th className="px-6 py-4">User</th>
                                                        <th className="px-6 py-4">Hotel</th>
                                                        <th className="px-6 py-4">Dates</th>
                                                        <th className="px-6 py-4">Amount</th>
                                                        <th className="px-6 py-4">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.map((b: any) => (
                                                        <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                                                            <td className="px-6 py-4">
                                                                <div className="font-medium text-gray-900">{b.userId?.name || 'Unknown'}</div>
                                                                <div className="text-xs text-gray-400">{b.userId?.email}</div>
                                                            </td>
                                                            <td className="px-6 py-4">{b.hotelId?.name}</td>
                                                            <td className="px-6 py-4">
                                                                {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 font-medium">${b.totalPrice}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${b.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                        b.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                    }`}>
                                                                    {b.bookingStatus}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Hotel Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingHotelId ? 'Edit Hotel' : 'Add New Hotel'}</h2>

                        <form onSubmit={handleSaveHotel} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location / Area</label>
                                    <input name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                                <input required name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="Free WiFi, Pool, Spa" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium shadow-md shadow-blue-500/20 transition">
                                    Save Hotel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
