import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    Host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image1: {
        type: String,
        required: true,
    },
    image2: {
        type: String,
    },
    image3: {
        type: String,
    },
    Rent: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    landMark: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    booking :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    }
}, { timestamps: true })

const Listing = new mongoose.model("Listing", listingSchema);
export default Listing;    