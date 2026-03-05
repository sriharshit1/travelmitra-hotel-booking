'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HotelCard from '@/components/ui/HotelCard';
import { HotelSkeleton } from '@/components/ui/LoadingSkeleton';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialCity = searchParams.get('city') || '';

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Filters state
    const [city, setCity] = useState(initialCity);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [rating, setRating] = useState('');
    const [sort, setSort] = useState('priceAsc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                city,
                sort,
                page: page.toString(),
                limit: '6'
            });
            if (minPrice) query.append('minPrice', minPrice);
            if (maxPrice) query.append('maxPrice', maxPrice);
            if (rating) query.append('rating', rating);

            const res = await fetch(`/api/hotels?${query.toString()}`);
            const data = await res.json();
            if (res.ok) {
                setHotels(data.hotels);
                setTotal(data.total);
                setTotalPages(data.pages);
            }
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchHotels();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [city, minPrice, maxPrice, rating, sort, page]);

    // Update URL on city change
    useEffect(() => {
        if (city !== initialCity) {
            const newParams = new URLSearchParams(searchParams.toString());
            if (city) newParams.set('city', city);
            else newParams.delete('city');
            router.push(`/search?${newParams.toString()}`, { scroll: false });
        }
    }, [city]);

    return (
        <>
            <Navbar />
            <main className="flex-grow pt-24 pb-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                                <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
                                    <FiFilter className="text-blue-600" />
                                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Destination */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => { setCity(e.target.value); setPage(1); }}
                                            placeholder="e.g. Paris"
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range / Night</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                                placeholder="Min"
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                                placeholder="Max"
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => { setRating(e.target.value); setPage(1); }}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                        >
                                            <option value="">Any Rating</option>
                                            <option value="4.5">4.5+ Excellent</option>
                                            <option value="4">4.0+ Very Good</option>
                                            <option value="3">3.0+ Good</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {city ? `Hotels in ${city}` : 'All Destinations'}
                                    </h1>
                                    <p className="text-gray-500 text-sm mt-1">{total} properties found</p>
                                </div>

                                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm relative">
                                    <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                                    <select
                                        value={sort}
                                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                                        className="bg-transparent text-sm font-semibold text-gray-900 outline-none appearance-none pr-6 cursor-pointer"
                                    >
                                        <option value="priceAsc">Price (Low to High)</option>
                                        <option value="priceDesc">Price (High to Low)</option>
                                        <option value="ratingDesc">Rating (High to Low)</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => <HotelSkeleton key={i} />)}
                                </div>
                            ) : hotels.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {hotels.map((hotel: any) => (
                                            <HotelCard key={hotel._id} hotel={hotel} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-12 space-x-2">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                                            >
                                                Previous
                                            </button>
                                            <div className="flex items-center px-4 font-medium text-gray-700">
                                                Page {page} of {totalPages}
                                            </div>
                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiFilter className="text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No hotels found</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or destination to find available properties.</p>
                                    <button
                                        onClick={() => { setCity(''); setMinPrice(''); setMaxPrice(''); setRating(''); }}
                                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-24 text-center">Loading search...</div>}>
            <SearchContent />
        </Suspense>
    );
}
