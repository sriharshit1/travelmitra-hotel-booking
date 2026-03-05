import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(req: Request) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const bookings = await Booking.find({ userId })
            .populate('hotelId', 'name city images rating location')
            .sort({ createdAt: -1 });

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching bookings', error: error.message }, { status: 500 });
    }
}
