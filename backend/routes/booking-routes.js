import express from 'express';
import authMiddlewares from '../middlewares/auth-middlewares.js';
import { createBooking, getMyBookings, cancelBooking , getBookingsByListingId } from '../controllers/booking-controllers.js';
const bookingRoutes = express.Router();

bookingRoutes.route("/create/:listId").post(authMiddlewares, createBooking)

bookingRoutes.route("/my-bookings").get(authMiddlewares, getMyBookings);

bookingRoutes.route("/cancel/:bookingId").delete(authMiddlewares, cancelBooking);

bookingRoutes.route('/getbookingid/:listId').get(authMiddlewares, getBookingsByListingId);

export default bookingRoutes;