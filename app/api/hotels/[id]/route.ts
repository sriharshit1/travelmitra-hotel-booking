import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Hotel from '@/models/Hotel';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
        }

        return NextResponse.json(hotel, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching hotel details', error: error.message }, { status: 500 });
    }
}
