'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';

export default function HeroSection() {
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const [guests, setGuests] = useState('2 Guests, 1 Room');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?city=${encodeURIComponent(destination)}`);
    };

    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background with abstract shapes */}
            <div className="absolute inset-0 z-0 bg-slate-50">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-white transform -skew-y-3 origin-top-left z-0"></div>
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl z-0"></div>
                <div className="absolute top-40 left-10 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl z-0"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6"
                >
                    Find Your Next <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Perfect Stay</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto"
                >
                    Discover premium hotels, resorts, and vacation rentals at unbeatable prices. Book your dream destination today.
                </motion.p>

                {/* Search Box - Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-white/70 backdrop-blur-xl p-3 md:p-4 rounded-3xl shadow-xl border border-white/50">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative flex items-center bg-white rounded-2xl p-2 px-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                                <FiMapPin className="text-gray-400 text-xl mr-3" />
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</span>
                                    <input
                                        type="text"
                                        placeholder="Where are you going?"
                                        className="w-full bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="md:w-64 relative flex items-center bg-white rounded-2xl p-2 px-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                                <FiCalendar className="text-gray-400 text-xl mr-3" />
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</span>
                                    <input
                                        type="text"
                                        placeholder="Check-in - Check-out"
                                        className="w-full bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400"
                                        value={dates}
                                        onChange={(e) => setDates(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="md:w-56 relative flex items-center bg-white rounded-2xl p-2 px-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                                <FiUsers className="text-gray-400 text-xl mr-3" />
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</span>
                                    <input
                                        type="text"
                                        placeholder="2 Guests"
                                        className="w-full bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 h-full md:w-32 rounded-2xl font-bold flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/40 transition-all group"
                            >
                                <span className="md:hidden mr-2">Search</span>
                                <FiSearch className="text-xl group-hover:scale-110 transition-transform" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
