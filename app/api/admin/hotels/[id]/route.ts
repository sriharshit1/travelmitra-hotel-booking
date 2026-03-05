import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Hotel from '@/models/Hotel';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const role = req.headers.get('x-user-role');
        if (role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const data = await req.json();
        await connectToDatabase();

        const updatedHotel = await Hotel.findByIdAndUpdate(id, data, { new: true });
        if (!updatedHotel) return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });

        return NextResponse.json({ message: 'Hotel updated successfully', hotel: updatedHotel }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating hotel', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const role = req.headers.get('x-user-role');
        if (role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const deletedHotel = await Hotel.findByIdAndDelete(id);
        if (!deletedHotel) return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });

        return NextResponse.json({ message: 'Hotel deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting hotel', error: error.message }, { status: 500 });
    }
}
