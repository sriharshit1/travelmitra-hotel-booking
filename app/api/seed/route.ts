import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Hotel from '@/models/Hotel';
import User from '@/models/User';
import bcrypt from 'bcrypt';

const sampleHotels = [
    {
        name: "The Ritz-Carlton, Paris",
        city: "Paris",
        location: "1st Arrondissement",
        description: "Experience unparalleled luxury in the heart of Paris. The Ritz-Carlton offers breathtaking views, exquisite dining, and world-class spa facilities.",
        price: 850,
        rating: 4.9,
        amenities: ["Free WiFi", "Spa", "Pool", "Restaurant", "Gym", "Room Service"],
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80"
        ]
    },
    {
        name: "Aman Tokyo",
        city: "Tokyo",
        location: "Chiyoda City",
        description: "A sanctuary at the top of the Otemachi Tower, Aman Tokyo blends traditional Japanese design with contemporary luxury.",
        price: 1200,
        rating: 4.9,
        amenities: ["Free WiFi", "Spa", "Pool", "Restaurant", "Bar"],
        images: [
            "https://images.unsplash.com/photo-1542314831-c6a4d14d88db?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80"
        ]
    },
    {
        name: "The Plaza Hotel",
        city: "New York",
        location: "Manhattan",
        description: "An iconic symbol of New York City, The Plaza offers a legendary experience right on Central Park South.",
        price: 950,
        rating: 4.7,
        amenities: ["Free WiFi", "Spa", "Restaurant", "Gym", "Concierge"],
        images: [
            "https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?auto=format&fit=crop&q=80"
        ]
    },
    {
        name: "Burj Al Arab",
        city: "Dubai",
        location: "Jumeirah Beach",
        description: "The world's only 7-star hotel, offering unmatched luxury, private beach access, and incredible dining.",
        price: 1500,
        rating: 4.9,
        amenities: ["Free WiFi", "Private Beach", "Pool", "Spa", "Restaurant", "Butler Service"],
        images: [
            "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&q=80"
        ]
    },
    {
        name: "Four Seasons Resort Bali",
        city: "Bali",
        location: "Ubud",
        description: "Nestled in the lush jungle of Ayung River valley, featuring private villas with plunge pools.",
        price: 650,
        rating: 4.8,
        amenities: ["Free WiFi", "Private Pool", "Spa", "Yoga Pavilion", "Restaurant"],
        images: [
            "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80"
        ]
    }
];

export async function GET() {
    try {
        await connectToDatabase();

        // 1. Seed Hotels
        await Hotel.deleteMany({});
        const insertedHotels = await Hotel.insertMany(sampleHotels);

        // 2. Create Admin User if not exists
        const adminEmail = "admin@travelmitra.com";
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                name: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                phone: "+1234567890",
                role: "admin"
            });
        }

        return NextResponse.json({
            message: 'Database seeded successfully',
            hotelsSeeded: insertedHotels.length,
            adminEmail: "admin@travelmitra.com",
            adminPassword: "admin123"
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error seeding database', error: error.message }, { status: 500 });
    }
}
