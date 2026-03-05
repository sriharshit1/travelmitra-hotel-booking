import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Hotel from '@/models/Hotel';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const rating = searchParams.get('rating');
        const sort = searchParams.get('sort') || 'createdAt';
        const limit = parseInt(searchParams.get('limit') || '10');
        const page = parseInt(searchParams.get('page') || '1');

        await connectToDatabase();

        const query: any = {};
        if (city) query.city = { $regex: new RegExp(city, 'i') };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (rating) query.rating = { $gte: Number(rating) };

        const sortOptions: any = {};
        if (sort === 'priceAsc') sortOptions.price = 1;
        else if (sort === 'priceDesc') sortOptions.price = -1;
        else if (sort === 'ratingDesc') sortOptions.rating = -1;
        else sortOptions.createdAt = -1;

        const skip = (page - 1) * limit;

        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .limit(limit)
            .skip(skip);

        const total = await Hotel.countDocuments(query);

        return NextResponse.json({ hotels, total, page, pages: Math.ceil(total / limit) }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching hotels', error: error.message }, { status: 500 });
    }
}
