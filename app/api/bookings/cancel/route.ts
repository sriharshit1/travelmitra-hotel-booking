import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function POST(req: Request) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { bookingId } = await req.json();

        if (!bookingId) {
            return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
        }

        await connectToDatabase();

        const booking = await Booking.findOne({ _id: bookingId, userId });

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found or unauthorized' }, { status: 404 });
        }

        if (booking.bookingStatus === 'cancelled') {
            return NextResponse.json({ message: 'Booking is already cancelled' }, { status: 400 });
        }

        booking.bookingStatus = 'cancelled';
        await booking.save();

        return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error cancelling booking', error: error.message }, { status: 500 });
    }
}
