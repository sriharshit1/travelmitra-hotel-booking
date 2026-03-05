export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(req: Request) {
    try {
        const role = req.headers.get('x-user-role');
        if (role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Fetch all bookings with user and hotel details populated
        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate('hotelId', 'name city')
            .sort({ createdAt: -1 });

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching bookings', error: error.message }, { status: 500 });
    }
}
