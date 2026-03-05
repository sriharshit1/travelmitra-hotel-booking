import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function POST(req: Request) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { hotelId, checkInDate, checkOutDate, guests, totalPrice } = body;

        if (!hotelId || !checkInDate || !checkOutDate || !guests || !totalPrice) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        const newBooking = new Booking({
            userId,
            hotelId,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            guests,
            totalPrice,
            bookingStatus: 'confirmed'
        });

        await newBooking.save();

        return NextResponse.json({ message: 'Booking successful', booking: newBooking }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error creating booking', error: error.message }, { status: 500 });
    }
}
