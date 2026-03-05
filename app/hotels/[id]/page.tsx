'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiMapPin, FiStar, FiCheck, FiHeart, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await fetch(`/api/hotels/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setHotel(data);
                } else {
                    toast.error(data.message || 'Hotel not found');
                }
            } catch (error) {
                toast.error('Error fetching hotel details');
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex flex-col pt-24 items-center">
                <h1 className="text-2xl font-bold">Hotel not found</h1>
                <button onClick={() => router.push('/search')} className="mt-4 text-blue-600">Back to search</button>
            </div>
        );
    }

    const dummyImages = hotel.images?.length ? hotel.images : [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070',
        'https://images.unsplash.com/photo-1542314831-c6a4d14d88db?auto=format&fit=crop&q=80&w=2070',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=2070'
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Hotel</span>
                                <FiStar className="text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold text-gray-700">{hotel.rating.toFixed(1)}</span>
                                <span>(128 Reviews)</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                            <div className="flex items-center text-gray-600">
                                <FiMapPin className="mr-2" />
                                {hotel.city}, {hotel.location || 'Central Area'}
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-4 md:mt-0">
                            <button
                                onClick={() => toast.success('Added to Wishlist!')}
                                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 shadow-sm"
                            >
                                <FiHeart className="text-red-500" />
                                <span>Save</span>
                            </button>
                            <button
                                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 shadow-sm"
                            >
                                <FiShare2 />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[500px]">
                        <div className="md:col-span-3 relative rounded-2xl overflow-hidden group">
                            <Image
                                src={dummyImages[activeImage]}
                                alt="Main Hotel Image"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="hidden md:flex flex-col gap-4">
                            {dummyImages.slice(1, 4).map((img: string, idx: number) => (
                                <div
                                    key={idx}
                                    className={`relative flex-1 rounded-2xl overflow-hidden cursor-pointer ${activeImage === idx + 1 ? 'ring-4 ring-blue-500' : ''}`}
                                    onClick={() => setActiveImage(idx + 1)}
                                >
                                    <Image src={img} alt="Thumbnail" fill className="object-cover hover:opacity-80 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Left Column: Details */}
                        <div className="flex-1 space-y-10">

                            {/* Description */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Property</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {hotel.description || 'Experience luxury and comfort in the heart of the city. Perfect for both business and leisure travelers looking for an unforgettable stay.'}
                                </p>
                            </section>

                            {/* Amenities */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                    {(hotel.amenities || ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym']).map((amenity: string, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-3 text-gray-700">
                                            <div className="bg-green-100 p-1 rounded-full"><FiCheck className="text-green-600 text-sm" /></div>
                                            <span className="font-medium">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Room Types (Mock for now, could use hotel.rooms) */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
                                <div className="space-y-4">
                                    {[
                                        { type: 'Deluxe Room', price: hotel.price, capacity: 2 },
                                        { type: 'Premium Suite', price: hotel.price * 1.5, capacity: 4 }
                                    ].map((room, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row items-center justify-between border border-gray-100 p-4 rounded-2xl hover:border-blue-200 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">{room.type}</h4>
                                                <p className="text-gray-500 text-sm">Up to {room.capacity} guests • 1 King Bed</p>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-right">
                                                <p className="text-2xl font-bold text-blue-600">${room.price}<span className="text-sm text-gray-500 font-normal">/night</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reviews Mock */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
                                <div className="space-y-6">
                                    {['John D.', 'Sarah M.'].map((name, idx) => (
                                        <div key={name} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-gray-900">{name}</span>
                                                <div className="flex text-yellow-400 text-sm"><FiStar className="fill-yellow-400" /><FiStar className="fill-yellow-400" /><FiStar className="fill-yellow-400" /><FiStar className="fill-yellow-400" /><FiStar className="fill-yellow-400" /></div>
                                            </div>
                                            <p className="text-gray-600 italic">"Absolutely wonderful stay. The staff was incredibly friendly and the rooms were spotless. Will definitely return!"</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Right Column: Booking Card */}
                        <div className="w-full lg:w-96">
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-gray-900">${hotel.price}</span>
                                    <span className="text-gray-500"> / night</span>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500">Check-In</p>
                                            <p className="font-medium text-gray-900">Select Date</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500 text-right">Check-Out</p>
                                            <p className="font-medium text-gray-900">Select Date</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-500">Guests</p>
                                        <p className="font-medium text-gray-900">2 Guests, 1 Room</p>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-3 text-gray-600">
                                    <span>${hotel.price} x 3 nights</span>
                                    <span>${hotel.price * 3}</span>
                                </div>
                                <div className="flex justify-between mb-6 text-gray-600">
                                    <span>Taxes & Fees</span>
                                    <span>${Math.round(hotel.price * 3 * 0.12)}</span>
                                </div>

                                <div className="flex justify-between mb-6 pt-4 border-t border-gray-200">
                                    <span className="font-bold text-lg text-gray-900">Total</span>
                                    <span className="font-bold text-lg text-blue-600">${(hotel.price * 3) + Math.round(hotel.price * 3 * 0.12)}</span>
                                </div>

                                <button
                                    onClick={() => router.push(`/book/${hotel._id}`)}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 transition-all"
                                >
                                    Book Now
                                </button>
                                <p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
