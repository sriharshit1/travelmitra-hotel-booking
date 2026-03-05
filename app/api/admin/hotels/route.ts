import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Hotel from '@/models/Hotel';

export async function GET(req: Request) {
    try {
        const role = req.headers.get('x-user-role');
        if (role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const hotels = await Hotel.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ hotels }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching hotels', error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const role = req.headers.get('x-user-role');
        if (role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const data = await req.json();
        await connectToDatabase();

        const newHotel = new Hotel(data);
        await newHotel.save();

        return NextResponse.json({ message: 'Hotel created successfully', hotel: newHotel }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error creating hotel', error: error.message }, { status: 500 });
    }
}
