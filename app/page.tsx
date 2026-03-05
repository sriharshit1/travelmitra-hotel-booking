import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HotelCard from '@/components/ui/HotelCard';
import SectionHeader from '@/components/ui/SectionHeader';
import connectToDatabase from '@/lib/db';
import Hotel from '@/models/Hotel';

// Server Component for fetching initial data
async function getTrendingHotels() {
    try {
        await connectToDatabase();
        const hotels = await Hotel.find({}).sort({ rating: -1 }).limit(4);
        // Serialize for client component passing
        return JSON.parse(JSON.stringify(hotels));
    } catch (error) {
        console.error('Failed to fetch hotels:', error);
        return [];
    }
}

export default async function HomePage() {
    const trendingHotels = await getTrendingHotels();

    return (
        <>
            <Navbar />
            <main className="flex-grow pb-24">
                <HeroSection />

                {/* Trending Destinations Component placeholder */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                    <SectionHeader
                        title="Trending Destinations"
                        subtitle="Most popular choices for travelers from around the world"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['Paris', 'Tokyo', 'New York', 'Dubai'].map((city, idx) => (
                            <div key={city} className={`relative rounded-2xl overflow-hidden h-64 group cursor-pointer ${idx === 0 || idx === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 
                  ${idx === 0 ? 'bg-blue-900/40' : idx === 1 ? 'bg-pink-900/40' : idx === 2 ? 'bg-orange-900/40' : 'bg-emerald-900/40'}`}>
                                </div>
                                <div className="absolute inset-0 bg-gray-200 z-0 group-hover:scale-110 transition-transform duration-700">
                                    {/* Using standard placeholder images for cities since no local images available */}
                                    <img src={`https://source.unsplash.com/600x400/?city,${city}`} alt={city} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute bottom-6 left-6 z-20">
                                    <h3 className="text-2xl font-bold text-white mb-1">{city}</h3>
                                    <p className="text-white/80 text-sm">Explore properties</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Hotels */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                    <SectionHeader
                        title="Premium Properties"
                        subtitle="Top-rated hotels and resorts for an unforgettable stay"
                    />
                    {trendingHotels.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {trendingHotels.map((hotel: any) => (
                                <HotelCard key={hotel._id} hotel={hotel} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                            <p>No hotels available at the moment. Run the seed script to populate data.</p>
                        </div>
                    )}
                </section>

            </main>
            <Footer />
        </>
    );
}
