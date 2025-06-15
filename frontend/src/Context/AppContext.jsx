import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const navigate = useNavigate();

    const [serverUrl] = useState(`https://airbnb-backend-s4mq.onrender.com`);
    const [userData, setUserData] = useState(null);

    // Listing states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [frontEndImage1, setFrontEndImage1] = useState("");
    const [frontEndImage2, setFrontEndImage2] = useState("");
    const [frontEndImage3, setFrontEndImage3] = useState("");
    const [backEndImage1, setBackEndImage1] = useState("");
    const [backEndImage2, setBackEndImage2] = useState("");
    const [backEndImage3, setBackEndImage3] = useState("");
    const [rent, setRent] = useState("");
    const [city, setCity] = useState("");
    const [landMark, setLandMark] = useState("");
    const [category, setCategory] = useState("");

    // Loading states
    const [adding, setAdding] = useState(false);
    const [loadingListings, setLoadingListings] = useState(false);

    // Listing data
    const [listingData, setListingData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    //booking 
    const [bookings, setBookings] = useState([]);
    const [cancellingBooking, setCancellingBooking] = useState(false);

    //search data
    const [searchData, setSearchData] = useState([])

    const [selectedCategory, setSelectedCategory] = useState("Trending"); 

    const handleAddListing = async () => {
        try {
            setAdding(true);
            let formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("image1", backEndImage1);
            formData.append("image2", backEndImage2);
            formData.append("image3", backEndImage3);
            formData.append("Rent", rent);
            formData.append("city", city);
            formData.append("landMark", landMark);
            formData.append("category", category);

            const response = await axios.post(`${serverUrl}/api/listing/add`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201 || response.status === 200) {
                toast.success("Listing added successfully!");
                resetForm();
                navigate("/");
                await getListing();
            }
        } catch (error) {
            console.error("Error in addListing:", error);
            toast.error(error.response?.data?.message || "Failed to add listing");
        } finally {
            setAdding(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setFrontEndImage1("");
        setFrontEndImage2("");
        setFrontEndImage3("");
        setBackEndImage1("");
        setBackEndImage2("");
        setBackEndImage3("");
        setRent("");
        setCity("");
        setLandMark("");
        setCategory("");
    };

    // Get all listings with proper error handling
    const getListing = async () => {
        try {
            setLoadingListings(true);
            const response = await axios.get(`${serverUrl}/api/listing/all-list`, {
                withCredentials: true,
                timeout: 10000 // 10 seconds timeout
            });

            if (response.status === 200) {
                const listings = response.data.allListing || [];
                setListingData(listings);

                // Apply filter based on current selected category
                if (selectedCategory === "Trending") {
                    setFilteredData(listings);
                } else {
                    setFilteredData(listings.filter(item => item.category === selectedCategory));
                }
            }
        } catch (error) {
            console.error("Error in getListing:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                toast.error(error.response.data.message || "Failed to load listings");
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("Network error - Could not connect to server");
            } else {
                console.error("Request setup error:", error.message);
                toast.error("Error fetching listings");
            }
            setListingData([]);
            setFilteredData([]);
        } finally {
            setLoadingListings(false);
        }
    };

    // Initial load
    useEffect(() => {
        getListing();
    }, []);

    // Filter data when category changes
    useEffect(() => {
        if (listingData && listingData.length > 0) {
            if (selectedCategory === "Trending") {
                setFilteredData(listingData); // Show all data for Trending
            } else {
                const filtered = listingData.filter(item => item.category === selectedCategory);
                setFilteredData(filtered);
            }
        }
    }, [selectedCategory, listingData]);

    //delete booking
    const cancelBooking = async (bookingId) => {
        try {
            setCancellingBooking(true);
            const response = await axios.delete(`${serverUrl}/api/booking/cancel/${bookingId}`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                // Update local state instead of reloading
                setBookings(prev => prev.filter(booking => booking._id !== bookingId));
                toast.success("Booking cancelled successfully");
                navigate("/")
                return true;
            }
            return false;
        } catch (error) {
            console.error("Booking cancellation error:", error);
            return false;
        } finally {
            setCancellingBooking(false);
        }
    };

    //search function
    const handleSearch = async (data) => {
        try {
            if (!data || data.trim() === '') {
                setSearchData([]);
                setFilteredData(listingData);
                return;
            }

            let response = await axios.get(`${serverUrl}/api/listing/search?query=${data.trim()}`);

            const searchResults = response.data.data || response.data.allListing || [];

            setSearchData(searchResults);
            setFilteredData(searchResults);

        } catch (error) {
            console.log("Error in fetching search data -> ", error);
            setSearchData([]);
            setFilteredData([]);
        }
    };

    // Add a clear search function
    const clearSearch = () => {
        setSearchData([]);
        setFilteredData(listingData);
    };

    const value = {
        serverUrl,
        userData,
        setUserData,

        // Listing form
        title, setTitle,
        description, setDescription,
        frontEndImage1, setFrontEndImage1,
        frontEndImage2, setFrontEndImage2,
        frontEndImage3, setFrontEndImage3,
        backEndImage1, setBackEndImage1,
        backEndImage2, setBackEndImage2,
        backEndImage3, setBackEndImage3,
        rent, setRent,
        city, setCity,
        landMark, setLandMark,
        category, setCategory,
        handleAddListing,
        adding, setAdding,
        resetForm,

        // Listings data
        listingData,
        setListingData,
        loadingListings,
        getListing,
        // Categories
        filteredData,
        setFilteredData,
        selectedCategory,
        setSelectedCategory,

        //cancel Booking
        bookings,
        setBookings,
        cancelBooking,
        cancellingBooking,

        //search
        handleSearch,
        clearSearch,
        searchData,
        setSearchData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
