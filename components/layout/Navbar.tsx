'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                            TravelMitra
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Find Hotels</Link>
                        <Link href="/deals" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Special Deals</Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors bg-blue-50 px-4 py-2 rounded-full"
                                >
                                    <FiUser className="text-xl" />
                                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                                        >
                                            <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Dashboard</Link>
                                            {user.role === 'admin' && (
                                                <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Admin Panel</Link>
                                            )}
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                            >
                                                <FiLogOut /> <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Log In</Link>
                                <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
                            {mobileMenuOpen ? <FiX className="text-3xl" /> : <FiMenu className="text-3xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 shadow-xl"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-4">
                            <Link href="/search" className="block text-gray-700 font-medium text-lg">Find Hotels</Link>
                            <Link href="/deals" className="block text-gray-700 font-medium text-lg">Special Deals</Link>

                            {user ? (
                                <>
                                    <Link href="/dashboard" className="block text-gray-700 font-medium text-lg">Dashboard</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" className="block text-purple-600 font-medium text-lg">Admin Panel</Link>
                                    )}
                                    <button onClick={logout} className="block text-red-600 font-medium text-lg w-full text-left">Sign Out</button>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col space-y-3">
                                    <Link href="/login" className="block text-center border border-gray-200 text-gray-700 py-3 rounded-xl font-medium">Log In</Link>
                                    <Link href="/register" className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
