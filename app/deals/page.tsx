'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { FiGift, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DealsPage() {
    const couponCode = 'LoveYou100';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(couponCode);
        toast.success('Coupon code copied!');
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-32 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl w-full bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden"
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-pink-500/30">
                            <FiGift className="text-white text-4xl" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Exclusive Offer!
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-medium">
                            Enjoy <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-3xl">100% OFF</span> on your next booking using
                            this special coupon code.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                            <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl py-4 px-6 text-center">
                                <span className="font-mono text-2xl font-bold tracking-widest text-gray-800">
                                    {couponCode}
                                </span>
                            </div>

                            <button
                                onClick={copyToClipboard}
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl py-4 px-8 font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                            >
                                <FiCopy className="text-xl" />
                                <span>Copy Code</span>
                            </button>
                        </div>

                        <p className="mt-8 text-sm text-gray-400">
                            * Terms and conditions apply. Valid for a limited time only.
                        </p>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
