'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HotelCard({ hotel }: { hotel: any }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
        >
            <div className="relative h-56 w-full overflow-hidden">
                {hotel.images && hotel.images[0] ? (
                    <Image
                        src={hotel.images[0]}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center space-x-1 shadow-sm">
                    <FiStar className="text-yellow-400 fill-yellow-400" />
                    <span>{hotel.rating.toFixed(1)}</span>
                </div>

                {/* Discount Badge Example */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Special Deal
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{hotel.name}</h3>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FiMapPin className="mr-1" />
                    <span className="truncate">{hotel.city} - {hotel.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities?.slice(0, 3).map((amenity: string, idx: number) => (
                        <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-medium">
                            {amenity}
                        </span>
                    ))}
                    {hotel.amenities?.length > 3 && (
                        <span className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-md font-medium">
                            +{hotel.amenities.length - 3} more
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Price per night</p>
                        <p className="text-2xl font-bold text-blue-600">${hotel.price}</p>
                    </div>
                    <Link
                        href={`/hotels/${hotel._id}`}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
