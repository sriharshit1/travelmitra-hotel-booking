'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiXCircle, FiSettings, FiHeart, FiFileText } from 'react-icons/fi';
import Image from 'next/image';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings/user');
            const data = await res.json();
            if (res.ok) setBookings(data.bookings);
        } catch (err) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'bookings') fetchBookings();
    }, [activeTab]);

    const handleCancelBooking = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const res = await fetch('/api/bookings/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: id })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                fetchBookings();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    if (!user) return null; // Middleware protects this route anyways

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="w-full md:w-72">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center sticky top-28">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-500/20">
                                    {user.name.charAt(0)}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 mb-6">{user.email}</p>

                                <div className="w-full space-y-2 mt-4">
                                    <button
                                        onClick={() => setActiveTab('bookings')}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <FiFileText /> <span>My Bookings</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('saved')}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'saved' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <FiHeart /> <span>Saved Hotels</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <FiSettings /> <span>Profile Settings</span>
                                    </button>
                                </div>

                                <button
                                    onClick={logout}
                                    className="w-full mt-8 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[500px]">

                                {activeTab === 'bookings' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Booking History</h2>
                                        {loading ? (
                                            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                                        ) : bookings.length > 0 ? (
                                            <div className="space-y-6">
                                                {bookings.map((booking: any) => (
                                                    <div key={booking._id} className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-2xl p-4 hover:shadow-md transition bg-white relative overflow-hidden">
                                                        {/* Color bar indicator */}
                                                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${booking.bookingStatus === 'confirmed' ? 'bg-green-500' :
                                                                booking.bookingStatus === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                                            }`}></div>

                                                        <div className="w-full md:w-48 h-32 relative rounded-xl overflow-hidden flex-shrink-0 ml-2">
                                                            {booking.hotelId?.images?.[0] ? (
                                                                <Image src={booking.hotelId.images[0]} alt="Hotel" fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200"></div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 flex flex-col justify-between ml-2">
                                                            <div>
                                                                <div className="flex justify-between items-start">
                                                                    <h3 className="text-lg font-bold text-gray-900">{booking.hotelId?.name || 'Unknown Hotel'}</h3>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                            booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                        }`}>
                                                                        {booking.bookingStatus}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-500 text-sm flex items-center mt-1"><FiMapPin className="mr-1" /> {booking.hotelId?.city}</p>

                                                                <div className="flex flex-wrap gap-4 mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                                    <div className="flex items-center text-sm">
                                                                        <FiCalendar className="text-gray-400 mr-2" />
                                                                        <span className="font-medium text-gray-900">
                                                                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 pl-0 md:pl-6">
                                                            <p className="text-2xl font-bold text-blue-600">${booking.totalPrice}</p>
                                                            {booking.bookingStatus !== 'cancelled' ? (
                                                                <button
                                                                    onClick={() => handleCancelBooking(booking._id)}
                                                                    className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center mt-4 bg-red-50 px-4 py-2 rounded-lg"
                                                                >
                                                                    <FiXCircle className="mr-1" /> Cancel Booking
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm italic mt-4">Cancelled</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><FiFileText className="text-2xl" /></div>
                                                <h3 className="text-xl font-bold text-gray-900">No bookings yet</h3>
                                                <p className="text-gray-500 mt-2">When you book a hotel, it will appear here.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'saved' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Saved Hotels</h2>
                                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"><FiHeart className="text-2xl" /></div>
                                            <h3 className="text-xl font-bold text-gray-900">Your wishlist is empty</h3>
                                            <p className="text-gray-500 mt-2">Save hotels you like and they will appear here.</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h2>
                                        <form className="max-w-md space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Profile updated successfully!'); }}>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input type="text" defaultValue={user.name} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                                            </div>
                                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                                                Save Changes
                                            </button>
                                        </form>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
}
