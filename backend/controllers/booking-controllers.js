import Booking from '../models/booking-models.js'
import User from '../models/user-models.js'
import Listing from '../models/listing-models.js'

const createBooking = async (request, responseponse) => {
    try {
        // Get listId from params
        const { listId } = request.params;

        // Validate input
        if (!listId || listId === "undefined") {
            return responseponse.status(400).json({
                message: "Listing ID is invalid or missing.",
            });
        }

        // Get booking details from body
        const { checkIn, checkOut, totalRent, guests = 1 } = request.body;

        // Validate dates
        if (!checkIn || !checkOut) {
            return responseponse.status(400).json({
                message: "Both check-in and check-out dates are requestuired",
            });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate >= checkOutDate) {
            return responseponse.status(400).json({
                message: "Check-out date must be after check-in date",
            });
        }

        // Check listing exists
        const listing = await Listing.findById(listId);
        if (!listing) {
            return responseponse.status(404).json({
                message: "Listing not found",
            });
        }

        // Check if user is trying to book their own listing
        if (listing.Host.toString() === request.userId) {
            return responseponse.status(400).json({
                message: "You cannot book your own listing",
            });
        }

        // Check for overlapping bookings
        const existingBooking = await Booking.findOne({
            listing: listId,
            status: "booked",
            $or: [
                {
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gt: checkInDate }
                }
            ]
        });

        if (existingBooking) {
            return responseponse.status(400).json({
                message: "Property is not available for selected dates",
            });
        }

        // Create booking
        const booking = await Booking.create({
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalRent,
            guests,
            Host: listing.Host,
            guest: request.userId,
            listing: listing._id,
        });

        await Listing.findByIdAndUpdate(listId, { isBooked: true });

        // Update user with booking ID 
        const user = await User.findByIdAndUpdate(
            request.userId,
            { $push: { booking: booking._id } },
            { new: true }
        );

        if (!user) {
            return responseponse.status(404).json({
                message: "User not found",
            });
        }

        return responseponse.status(201).json({
            message: "Booking created successfully",
            booking,
        });

    } catch (error) {
        console.error("Booking error:", error);
        return responseponse.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getMyBookings = async (request, responseponse) => {
    try {
        // userid lo pahile 
        const userId = request.userId;

        const myBookings = await Booking.find({ guest: userId })
            .populate({
                path: 'listing',
                select: 'title city image1 Rent category',
            })
            .populate({
                path: 'Host',
                select: 'name email',
            })
            .sort({ createdAt: -1 });

        if (!myBookings || myBookings.length === 0) {
            return responseponse.status(404).json({ message: "No bookings found!" });
        }

        return responseponse.status(200).json(myBookings);

    } catch (error) {
        console.error("Error in getMyBookings controller:", error.message);
        return response.status(500).json({ message: "Server Error" });
    }
}

// In booking-controllers.js
const cancelBooking = async (request, response) => {
    try {
        const { bookingId } = request.params;

        if (!bookingId) {
            return response.status(400).json({ message: "Booking ID missing" });
        }

        // Find and validate booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return response.status(404).json({ message: "Booking not found" });
        }

        // Authorization check
        if (booking.guest.toString() !== request.userId) {
            return response.status(403).json({ message: "Unauthorized action" });
        }

        // Update listing status first
        await Listing.findByIdAndUpdate(booking.listing, {
            isBooked: false,
        });

        // Remove booking from user's bookings array
        await User.findByIdAndUpdate(request.userId, {
            $pull: { bookings: bookingId },
        });

        // Delete the booking
        await Booking.findByIdAndDelete(bookingId);

        return response.status(200).json({ 
            message: "Booking cancelled successfully",
            cancelledBookingId: bookingId
        });

    } catch (error) {
        console.error("Cancel booking error:", error);
        return response.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
}

const getBookingsByListingId = async (req, res) => {
    try {
        const { listId } = req.params;

        if (!listId) {
            return res.status(400).json({ message: "Listing ID is required" });
        }

        const bookings = await Booking.find({ listing: listId })
            .populate("guest", "name email")
            .sort({ checkIn: 1 });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this listing" });
        }

        return res.status(200).json(bookings);

    } catch (error) {
        console.error("Error in getBookingsByListingId ->", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { createBooking, getMyBookings, cancelBooking, getBookingsByListingId };
