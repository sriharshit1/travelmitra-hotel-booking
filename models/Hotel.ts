import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    location: { type: String },
    rooms: [{
        type: { type: String },
        price: { type: Number },
        capacity: { type: Number },
        count: { type: Number }
    }],
}, { timestamps: true });

export default mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
