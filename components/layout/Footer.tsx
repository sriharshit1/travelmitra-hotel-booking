import Link from 'next/link';
import { FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="flex flex-col mb-8 md:mb-0">
                        <span className={`text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4`}>
                            TravelMitra
                        </span>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Your trusted platform for discovering and booking the perfect stay around the globe. Premium experiences await.
                        </p>
                        <div className="flex space-x-4 text-gray-400">
                            <a href="#" className="hover:text-blue-500 transition-colors"><FiTwitter size={20} /></a>
                            <a href="#" className="hover:text-blue-600 transition-colors"><FiFacebook size={20} /></a>
                            <a href="#" className="hover:text-pink-600 transition-colors"><FiInstagram size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                            <li><Link href="/press" className="hover:text-blue-600 transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/help" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Destinations</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/search?city=paris" className="hover:text-blue-600 transition-colors">Paris</Link></li>
                            <li><Link href="/search?city=tokyo" className="hover:text-blue-600 transition-colors">Tokyo</Link></li>
                            <li><Link href="/search?city=new+york" className="hover:text-blue-600 transition-colors">New York</Link></li>
                            <li><Link href="/search?city=dubai" className="hover:text-blue-600 transition-colors">Dubai</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} TravelMitra. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex space-x-4 justify-center">
                        <span className="cursor-pointer hover:text-gray-600">English (US)</span>
                        <span className="cursor-pointer hover:text-gray-600">USD ($)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
