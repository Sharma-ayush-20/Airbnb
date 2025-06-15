import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    //kon listing banaya hai
    Host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    //kon ye listing ko book kiya hai means buy kiya hai
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    //listing ki id
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    status: {
        type: String,
        enum: ["booked", "cancel"],
        default: "booked"
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    totalRent: {
        type: Number,
        required: true,
    },

}, { timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;