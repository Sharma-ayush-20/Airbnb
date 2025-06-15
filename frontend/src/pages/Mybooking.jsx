import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Mybooking() {
    const { serverUrl, userData } = useContext(AppContext);
    const { bookings, setBookings } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { cancelBooking, cancellingBooking } = useContext(AppContext);
    const navigate = useNavigate();
    // console.log(bookings)
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/booking/my-bookings`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setBookings(response.data || []);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load bookings.');
                console.error('Booking fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        
        if (userData) {
            fetchBookings();
        } else {
            setLoading(false);
            setError('Please login to view bookings');
        }
    }, [serverUrl, userData, setBookings]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(bookingId);
                // Update local state after cancellation
                setBookings(bookings.map(booking => 
                    booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
                ));
                toast.success("Booking Delete SuccessFully.")
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to cancel booking.');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-slate-600 font-medium">Loading your bookings...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 border border-red-100">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
                    <p className="text-red-500 mb-4">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Try Again
                        </button>
                        {error === 'Please login to view bookings' && (
                            <button 
                                onClick={() => navigate('/login')} 
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (bookings.length === 0 && !error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
            {/* Home Button */}
            <button onClick={() => navigate("/")}
                className="fixed top-4 right-2 sm:top-6 sm:right-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-red-300/20 cursor-pointer">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Home</span>
            </button>
            
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md mx-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring amazing places!</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Explore Properties
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
            {/* Home Button */}
            <button onClick={() => navigate("/")}
                className="fixed top-4 right-2 sm:top-6 sm:right-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-red-300/20 cursor-pointer">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Home</span>
            </button>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-red-500 bg-clip-text mb-4">
                        My Bookings
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Manage and track all your property bookings in one place
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
                </div>


                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {bookings.map((booking, index) => (
                        <div key={booking._id} 
                             className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                             style={{ animationDelay: `${index * 100}ms` }}>
                            
                            {/* Image Container */}
                            <div className="relative overflow-hidden h-56">
                                <img
                                    src={booking.listing?.image1 || '/placeholder-property.jpg'}
                                    alt={booking.listing?.title || 'Property image'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Status Badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg ${
                                    booking.status === 'confirmed' 
                                        ? 'bg-emerald-500/90 text-white border-emerald-400/20' 
                                        : booking.status === 'cancelled'
                                        ? 'bg-red-500/90 text-white border-red-400/20'
                                        : 'bg-amber-500/90 text-white border-amber-400/20'
                                }`}>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${
                                            booking.status === 'confirmed' 
                                                ? 'bg-emerald-200' 
                                                : booking.status === 'cancelled'
                                                ? 'bg-red-200'
                                                : 'bg-amber-200'
                                        } animate-pulse`}></div>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {booking.listing?.title || 'Unknown Property'}
                                </h2>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">{booking.listing?.city || 'Unknown location'}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">
                                            <span className="font-medium">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">
                                            <span className="font-medium">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-600 font-medium">Total Amount</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Rs {booking?.totalRent?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                    
                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            disabled={cancellingBooking === booking._id}
                                            className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                                                cancellingBooking === booking._id
                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-md hover:shadow-lg'
                                            }`}
                                        >
                                            {cancellingBooking === booking._id ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Cancelling...
                                                </span>
                                            ) : (
                                                'Cancel Booking'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Mybooking;