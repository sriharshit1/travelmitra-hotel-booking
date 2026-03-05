'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { FiCalendar, FiUsers, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function BookingPage({ params }: { params: Promise<{ hotelId: string }> }) {
    const router = useRouter();
    const { hotelId } = use(params);
    const { user } = useAuth();

    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Form State (Mock Defaults)
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [nights, setNights] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const [step, setStep] = useState(1); // 1 = Review, 2 = Payment, 3 = Confirmation

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await fetch(`/api/hotels/${hotelId}`);
                const data = await res.json();
                if (res.ok) {
                    setHotel(data);
                    // Set mock calculation
                    setCheckIn(new Date().toISOString().split('T')[0]);
                    const tmrw = new Date();
                    tmrw.setDate(tmrw.getDate() + 3);
                    setCheckOut(tmrw.toISOString().split('T')[0]);
                    setNights(3);
                    setTotalPrice(data.price * 3 + Math.round(data.price * 3 * 0.12));
                }
            } catch (error) {
                toast.error('Error fetching hotel details');
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [hotelId]);

    const handleBooking = async () => {
        setProcessing(true);
        try {
            const res = await fetch('/api/bookings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hotelId: hotelId,
                    checkInDate: checkIn,
                    checkOutDate: checkOut,
                    guests,
                    totalPrice
                })
            });
            const data = await res.json();
            if (res.ok) {
                setStep(3); // Go to confirmation page
                toast.success(data.message);
            } else {
                toast.error(data.message || 'Booking failed');
            }
        } catch (err) {
            toast.error('An unexpected error occurred');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Loading booking details...</p></div>;
    if (!hotel) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Hotel not found</p></div>;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {step === 3 ? (
                        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100 mt-10">
                            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiCheckCircle className="text-5xl" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                            <p className="text-gray-600 mb-8 text-lg">Thank you for booking {hotel.name} with TravelMitra. Your reservation details have been sent to your email.</p>

                            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Check-in</p>
                                        <p className="font-bold text-gray-900">{checkIn}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Check-out</p>
                                        <p className="font-bold text-gray-900">{checkOut}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Guests</p>
                                        <p className="font-bold text-gray-900">{guests} Adults</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Paid</p>
                                        <p className="font-bold text-blue-600">${totalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                                >
                                    View My Bookings
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
                                >
                                    Return Home
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Main Column */}
                            <div className="flex-1 space-y-8">
                                <h1 className="text-3xl font-bold text-gray-900">Confirm and Pay</h1>

                                {/* Guest Details */}
                                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><FiUsers className="mr-2 text-blue-600" /> Main Guest Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input type="text" defaultValue={user?.name?.split(' ')[0] || ''} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input type="text" defaultValue={user?.name?.split(' ')[1] || ''} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none block" disabled />
                                            <p className="text-xs text-gray-500 mt-2">Booking confirmation will be sent to this email.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Edit Dates (Mock) */}
                                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><FiCalendar className="mr-2 text-blue-600" /> Edit Trip Dates</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                                            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                                            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Form */}
                                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><FiCreditCard className="mr-2 text-blue-600" /> Payment Methods</h2>
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <input type="radio" checked readOnly className="w-4 h-4 text-blue-600" />
                                            <span className="font-semibold text-gray-900 text-lg">Credit Card</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                                                    <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBooking}
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:transform-none flex items-center justify-center space-x-2"
                                    >
                                        <span>{processing ? 'Processing Payment...' : `Complete Booking • $${totalPrice}`}</span>
                                    </button>
                                    <p className="text-center text-sm text-gray-500 mt-4 leading-relaxed">
                                        By clicking to complete this booking, I acknowledge that I have read and accept the Rules & Restrictions and Terms of Use.
                                    </p>
                                </section>
                            </div>

                            {/* Sidebar Booking Summary */}
                            <div className="w-full lg:w-[400px]">
                                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-28">
                                    <div className="flex space-x-4 mb-6 pb-6 border-b border-gray-100">
                                        <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0">
                                            <Image src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'} alt="Hotel" fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">{hotel.city}</p>
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{hotel.name}</h3>
                                            <div className="flex items-center space-x-1 mt-2">
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold">{hotel.rating.toFixed(1)}</span>
                                                <span className="text-xs text-gray-500">Excellent</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Price Breakdown</h3>

                                    <div className="space-y-3 text-gray-600 mb-6 pb-6 border-b border-gray-100">
                                        <div className="flex justify-between">
                                            <span>${hotel.price} x {nights} nights</span>
                                            <span>${hotel.price * nights}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Taxes & Fees</span>
                                            <span>${Math.round(hotel.price * nights * 0.12)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Total Cost</span>
                                        <span className="text-2xl text-blue-600">${totalPrice}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
