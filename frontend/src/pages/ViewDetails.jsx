import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaWifi, FaParking, FaTv, FaUtensils, FaSnowflake, FaTimes } from 'react-icons/fa';
import { MdOutlinePool, MdPets, MdLocalLaundryService } from 'react-icons/md';
import { GiDesk } from 'react-icons/gi';
import { toast } from 'react-toastify';

function ViewDetails() {
    const { serverUrl, userData, cancelBooking } = useContext(AppContext);
    const { listId } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPopUp, setShowPopUp] = useState(false);
    const [bookingPopUp, setBookingPopUp] = useState(false);
    const [submitting, setSubmitting] = useState(false);
   
    // Booking form state
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [calNight, setCalNight] = useState(0);
    const [totalCharge, setTotalCharge] = useState(0);
    const [guests, setGuests] = useState(1);
     //delete
    const [bookingId, setBookingId] = useState("")
    // console.log(bookingId[0]._id)
    const [showDeleteBookingConfirm, setShowDeleteBookingConfirm] = useState(false);


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rent: '',
        city: '',
        landMark: '',
        image1: null,
        image2: null,
        image3: null,
    });

    // Fetch listing details
    useEffect(() => {
        const fetchListingDetails = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/listing/view/${listId}`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setListing(response.data);
                    setFormData({
                        title: response.data.title || '',
                        description: response.data.description || '',
                        rent: response.data.Rent || '',
                        city: response.data.city || '',
                        landMark: response.data.landMark || '',
                        image1: null,
                        image2: null,
                        image3: null
                    });
                }
            } catch (error) {
                console.error("Error fetching listing:", error);
                // toast.error("Failed to load listing details");
            } finally {
                setLoading(false);
            }
        };

        if (listId) {
            fetchListingDetails();
        }
    }, [listId, serverUrl]);

    //get booking id
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/booking/getbookingid/${listId}`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setBookingId(response.data)
                }
            } catch (err) {
                console.error("Error fetching host bookings:", err);
            }
        };

        fetchBookings();
    }, []);


    // Calculate nights and total charge 
    useEffect(() => {
        if (checkIn && checkOut && listing?.Rent) {
            const inDate = new Date(checkIn);
            const outDate = new Date(checkOut);
            const nights = Math.ceil((outDate - inDate) / (24 * 60 * 60 * 1000));

            if (nights > 0) {
                setCalNight(nights);
                const baseAmount = listing.Rent * nights;
                const airbnbCharge = (listing.Rent * 0.07);
                const tax = (listing.Rent * 0.07);
                setTotalCharge(baseAmount + airbnbCharge + tax);
            } else {
                setCalNight(0);
                setTotalCharge(0);
            }
        } else {
            setCalNight(0);
            setTotalCharge(0);
        }
    }, [checkIn, checkOut, listing?.Rent]);

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, imageKey) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }
        setFormData(prev => ({
            ...prev,
            [imageKey]: file
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("Rent", formData.rent);
            formDataToSend.append("city", formData.city);
            formDataToSend.append("landMark", formData.landMark);
            formDataToSend.append("category", listing.category);

            if (formData.image1 instanceof File) formDataToSend.append("image1", formData.image1);
            if (formData.image2 instanceof File) formDataToSend.append("image2", formData.image2);
            if (formData.image3 instanceof File) formDataToSend.append("image3", formData.image3);

            const response = await axios.post(
                `${serverUrl}/api/listing/edit-listing/${listId}`,
                formDataToSend,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Listing updated successfully");
                setShowPopUp(false);
                const refreshedResponse = await axios.get(`${serverUrl}/api/listing/view/${listId}`, {
                    withCredentials: true,
                });
                setListing(refreshedResponse.data);
            }
        } catch (error) {
            console.error("Error updating listing:", error);
            toast.error(error.response?.data?.message || "Failed to update listing");
        } finally {
            setSubmitting(false);
        }
    };


    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!userData) {
            navigate("/login");
            return;
        }

        if (!checkIn || !checkOut) {
            return;
        }

        if (calNight <= 0) {
            return;
        }

        setSubmitting(true);
        try {
            const bookingData = {
                checkIn: checkIn,
                checkOut: checkOut,
                totalRent: totalCharge,
                guests: guests,
                nights: calNight
            };

            console.log("Booking data:", bookingData);

            const response = await axios.post(
                `${serverUrl}/api/booking/create/${listId}`,
                bookingData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                toast.success("Booking confirmed successfully!");
                setBookingPopUp(false);
                // Reset booking form
                setCheckIn("");
                setCheckOut("");
                setGuests(1);
                window.location.reload()
                navigate("/");
            }
        } catch (error) {
            console.error("Booking error:", error);
            // console.error("Error response:", error.response?.data); 
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-600">Listing not found</div>
            </div>
        );
    }

    const images = [listing.image1, listing.image2, listing.image3].filter(img => img);
    const amenities = [
        { icon: <FaWifi className="mr-3 text-gray-700" />, name: "WiFi", available: listing.amenities?.wifi },
        { icon: <FaParking className="mr-3 text-gray-700" />, name: "Parking", available: listing.amenities?.parking },
        { icon: <FaTv className="mr-3 text-gray-700" />, name: "TV", available: listing.amenities?.tv },
        { icon: <FaUtensils className="mr-3 text-gray-700" />, name: "Kitchen", available: listing.amenities?.kitchen },
        { icon: <FaSnowflake className="mr-3 text-gray-700" />, name: "AC", available: listing.amenities?.ac },
        { icon: <MdOutlinePool className="mr-3 text-gray-700" size={20} />, name: "Pool", available: listing.amenities?.pool },
        { icon: <MdPets className="mr-3 text-gray-700" size={20} />, name: "Pets", available: listing.amenities?.pets },
        { icon: <MdLocalLaundryService className="mr-3 text-gray-700" size={20} />, name: "Washer", available: listing.amenities?.washer },
        { icon: <GiDesk className="mr-3 text-gray-700" size={20} />, name: "Workspace", available: listing.amenities?.workspace }
    ].filter(amenity => amenity.available);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Home Button */}
            <button
                onClick={() => navigate("/")}
                className="fixed top-4 right-2 sm:top-6 sm:right-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-red-300/20 cursor-pointer"
                aria-label="Go back to home"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Home</span>
            </button>

            {/* Image Gallery */}
            {images.length > 0 && (
                <div className="relative mb-8 mt-14">
                    <div className="relative h-96 w-full rounded-xl overflow-hidden">
                        <img
                            src={images[currentImageIndex]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageChange(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-6' : 'bg-white/50'}`}
                                        aria-label={`View image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`h-24 rounded-lg overflow-hidden cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-pink-500' : ''}`}
                                    onClick={() => handleImageChange(index)}
                                    aria-label={`Thumbnail ${index + 1}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <FaMapMarkerAlt className="mr-1 text-red-500" />
                            <span>{listing.landMark}, {listing.city}</span>
                        </div>

                        <div className="flex items-center space-x-6 mb-6">
                            <div className="flex items-center">
                                <FaBed className="mr-2 text-gray-500" />
                                <span>{listing.bedrooms || 1} beds</span>
                            </div>
                            <div className="flex items-center">
                                <FaBath className="mr-2 text-gray-500" />
                                <span>{listing.bathrooms || 1} bath</span>
                            </div>
                            <div className="flex items-center">
                                <FaRulerCombined className="mr-2 text-gray-500" />
                                <span>{listing.area || 'N/A'} sqft</span>
                            </div>
                        </div>

                        <div className="border-t border-b border-gray-200 py-6 my-6">
                            <h2 className="text-xl font-semibold mb-4">About this place</h2>
                            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                        </div>

                        {amenities.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center">
                                            {amenity.icon}
                                            <span>{amenity.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Booking Card */}
                <div className="sticky top-4 h-fit">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-2xl font-bold">Rs {listing.Rent}</span>
                                <span className="text-gray-600"> / night</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">{listing.category}</span>
                            </div>
                        </div>

                        <div className="space-y-4">

                            {userData && userData._id !== listing.Host && (
                                listing.isBooked && bookingId[0]?.guest?._id === userData._id ? (
                                    <>
                                        <p
                                            onClick={() => navigate("/mybooking")}
                                            className="text-center w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                                        >
                                            Already booked.
                                        </p>
                                        <button
                                            onClick={() => setShowDeleteBookingConfirm(true)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-2"
                                        >
                                            Cancel Booking
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setBookingPopUp(true)}
                                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                                        aria-label="Book this property"
                                    >
                                        Book Now
                                    </button>
                                )
                            )}



                            {userData && userData._id === listing.Host && (
                                <button
                                    onClick={() => setShowPopUp(true)}
                                    className="cursor-pointer w-full bg-white border border-gray-300 hover:bg-green-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200"
                                    aria-label="Edit this listing"
                                >
                                    Edit Listing
                                </button>
                            )}

                            {/* {userData && userData._id === listing.Host && (
                                <button
                                    onClick={() => setDeleteConfirm(true)}
                                    className="cursor-pointer w-full bg-white border border-gray-300 hover:bg-red-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200"
                                    aria-label="Delete this listing"
                                >
                                    Delete Listing
                                </button>
                            )} */}

                            <div className="text-center text-gray-500 text-sm">
                                You won't be charged yet
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rs {listing.Rent} x {calNight || 1} nights</span>
                                <span>Rs {(listing.Rent * (calNight || 1)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Service fee</span>
                                <span>Rs {(listing.Rent * 0.07).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>Rs {(listing.Rent * 0.07).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold">
                                <span>Total</span>
                                <span>Rs {totalCharge > 0 ? totalCharge.toFixed(2) : (listing.Rent * 1.14).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Listing Popup */}
            {showPopUp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gradient-to-r from-pink-500 to-red-500">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                                    Edit Listing
                                </h2>
                                <button
                                    onClick={() => setShowPopUp(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    aria-label="Close edit form"
                                >
                                    <FaTimes size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        type="text"
                                        name="title"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                        required
                                        placeholder="Beautiful modern apartment"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        name="description"
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                        required
                                        placeholder="Describe your property in detail..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Rent (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                            <input
                                                value={formData.rent}
                                                onChange={handleInputChange}
                                                type="number"
                                                name="rent"
                                                min="1"
                                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                                required
                                                placeholder="15000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            type="text"
                                            name="city"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            required
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Landmark</label>
                                    <input
                                        value={formData.landMark}
                                        onChange={handleInputChange}
                                        type="text"
                                        name="landMark"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                        required
                                        placeholder="Near Marine Drive"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Images <span className="text-gray-500 text-xs">(Optional - leave empty to keep current)</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[1, 2, 3].map((index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="relative group">
                                                    <div className="w-full h-40 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                                                        {listing[`image${index}`] ? (
                                                            <img
                                                                src={listing[`image${index}`]}
                                                                alt={`Current ${index}`}
                                                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
                                                            />
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                                        <span className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                            {formData[`image${index}`] ? "Changed" : "Change"}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileChange(e, `image${index}`)}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="text-center text-xs text-gray-500">
                                                    {formData[`image${index}`] ? "New image selected" : "Click to change"}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Booking Popup */}
            {bookingPopUp && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-5">
                    <div className="bg-sky-50 rounded-[20px] shadow-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                                    Confirm Your Booking
                                </h2>
                                <button
                                    onClick={() => setBookingPopUp(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                                    aria-label="Close booking form"
                                >
                                    <FaTimes size={28} />
                                </button>
                            </div>

                            <div className="mb-8">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden">
                                        <img
                                            src={images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="w-full md:w-2/3">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <FaMapMarkerAlt className="mr-1 text-red-500" />
                                            <span>{listing.landMark}, {listing.city}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{listing.category}</span>
                                            <div className="flex items-center text-sm">
                                                <FaBed className="mr-1 text-gray-500" />
                                                <span>{listing.bedrooms || 1} beds</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 line-clamp-3">{listing.description}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleBookingSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => {
                                                setCheckIn(e.target.value);
                                                if (checkOut && new Date(e.target.value) > new Date(checkOut)) {
                                                    setCheckOut("");
                                                }
                                            }}
                                            value={checkIn}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                            required
                                            min={checkIn || new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            value={checkOut}
                                            disabled={!checkIn}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-6">
                                    <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Rs {listing.Rent} x {calNight} nights</span>
                                            <span>₹{(listing.Rent * calNight).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Service fee</span>
                                            <span>₹{(listing.Rent * 0.07).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span>₹{(listing.Rent * 0.07).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>₹{totalCharge.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                        <span>Credit/Debit Card</span>
                                    </div>
                                </div> */}

                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 mr-2 rounded focus:ring-pink-500"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        I agree to the terms and conditions and privacy policy
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting || !checkIn || !checkOut}
                                        className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Processing...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Booking Confirmation Dialog */}
            {showDeleteBookingConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Confirm Cancellation</h3>
                            <button
                                onClick={() => setShowDeleteBookingConfirm(false)}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Close confirmation dialog"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <p className="mb-6 text-gray-600">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteBookingConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                No, Keep Booking
                            </button>
                            <button
                                onClick={() => cancelBooking(bookingId[0]._id)}
                                disabled={submitting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Cancelling...' : 'Yes, Cancel Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewDetails;