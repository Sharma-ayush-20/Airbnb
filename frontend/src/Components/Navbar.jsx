import React, { useState, useContext, useEffect } from 'react'
import { FaSearch } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import { MdWhatshot, MdVilla, MdHome, MdPool } from "react-icons/md";
import { FaBuilding, FaBed, FaStore } from "react-icons/fa";
import { GiWoodCabin, GiFarmTractor } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';

function Navbar() {
    const categories = [
        { icon: MdWhatshot, name: "Trending" },
        { icon: MdVilla, name: "Villa" },
        { icon: GiFarmTractor, name: "Farm House" },
        { icon: MdPool, name: "Pool House" },
        { icon: FaBed, name: "Rooms" },
        { icon: FaBuilding, name: "Flat" },
        { icon: MdHome, name: "PG" },
        { icon: GiWoodCabin, name: "Cabins" },
        { icon: FaStore, name: "Shops" }
    ];

    const [hamburger, setHamburger] = useState(false);

    //search
    const [input, setInput] = useState("")
    const navigate = useNavigate();

    const {
        serverUrl,
        userData,
        setUserData,
        selectedCategory,
        setSelectedCategory,
        listingData, 
        setFilteredData, 
        searchData,
        handleSearch,
        setSearchData
    } = useContext(AppContext);

    // trending default select hoga 
    useEffect(() => {
        if (!selectedCategory) {
            setSelectedCategory("Trending");
        }
    }, [selectedCategory, setSelectedCategory]);

    // Function to logout
    const handleLogOut = async () => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/logout`, {}, {
                withCredentials: true
            });
            if (response.status === 201 || response.status === 200) {
                setUserData(null);
                navigate('/');
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    // Fetch current user data
    useEffect(() => {
        const fetchCurrentUserData = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/user/currentuser`, {
                    withCredentials: true,
                });
                if (response.status === 201 || response.status === 200) {
                    setUserData(response.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (serverUrl) {
            fetchCurrentUserData();
        }
    }, [serverUrl, setUserData]);

    // Function to filter data according to category
    const handleCategoryFilter = () => {
        if (!listingData || !setFilteredData) return; // Add safety check

        if (selectedCategory === "Trending") {
            setFilteredData(listingData); // Show all data for Trending
        } else {
            const filtered = listingData.filter(
                (item) => item.category === selectedCategory
            );
            setFilteredData(filtered);
        }
    };

    // Apply filter whenever selectedCategory or listingData changes
    useEffect(() => {
        if (listingData && listingData.length > 0) {
            handleCategoryFilter();
        }
    }, [selectedCategory, listingData]); // Remove handleCategoryFilter from dependencies


    // Update the search useEffect with better debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (input.trim()) {
                handleSearch(input);
            } else {
                // Clear search results when input is empty and show filtered data based on category
                setSearchData([]);
                if (selectedCategory === "Trending") {
                    setFilteredData(listingData);
                } else {
                    const filtered = listingData.filter(item => item.category === selectedCategory);
                    setFilteredData(filtered);
                }
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [input, listingData, selectedCategory]);

    // Update the search button click handlers
    const handleSearchClick = () => {
        if (input.trim()) {
            handleSearch(input);
            navigate("/");
        }
    };

    return (
        <>
            <div>
                <div className='w-full shadow-sm border-b border-gray-200 sticky top-0 bg-white z-50'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex items-center justify-between h-20'>
                            {/* Logo */}
                            <h1
                                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-red-500 cursor-pointer transition duration-300 hover:scale-105"
                                onClick={() => {
                                    setSelectedCategory("Trending");
                                    navigate("/");
                                }}
                            >
                                StayEase
                            </h1>


                            {/* Search Bar */}
                            <div className='hidden md:flex flex-1 max-w-md mx-8'>
                                <div className='relative w-full'>
                                    <input
                                        onChange={(e) => setInput(e.target.value)}
                                        value={input}
                                        type="text"
                                        placeholder="Any Where | Any Location | Any City"
                                        className='w-full pl-6 pr-12 py-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200'
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearchClick();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSearchClick}
                                        className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors duration-200'
                                    >
                                        <FaSearch className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                            {/* Right Side */}
                            <div className='flex items-center space-x-4'>
                                <span onClick={() => navigate("/listingpage1")}
                                    className='hidden lg:block text-sm font-medium text-gray-700 hover:text-red-400 cursor-pointer transition-colors duration-200'>
                                    List Your Home
                                </span>

                                {/* Hamburger */}
                                <div className='relative'>
                                    <div onClick={() => setHamburger(!hamburger)}
                                        className='flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-3 hover:shadow-md transition-shadow duration-200 cursor-pointer'>
                                        <RxHamburgerMenu className='w-4 h-4 text-gray-600' />
                                        {userData === null ? (
                                            <div className='bg-gray-500 rounded-full p-1'>
                                                <FaUser className='w-4 h-4 text-white' />
                                            </div>
                                        ) : (
                                            <div className='bg-gray-500 rounded-full p-2 flex items-center justify-center w-8 h-8'>
                                                <div className='text-white text-sm font-medium leading-none'>
                                                    {userData.name.slice(0, 1).toUpperCase()}
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Dropdown */}
                                    {hamburger && (
                                        <div className='w-[240px] absolute top-[calc(100%+8px)] right-0 z-10 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden'>
                                            <div className='py-2'>
                                                {/* User Actions */}
                                                <ul className='space-y-1'>
                                                    {userData === null && <li onClick={() => navigate('/login')}
                                                        className='px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-gray-700 hover:text-gray-900'>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                        </svg>
                                                        <span className='font-medium text-sm'>Login</span>
                                                    </li>}
                                                    {userData !== null && <li onClick={handleLogOut}
                                                        className='px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-gray-700 hover:text-gray-900'>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        <span className='font-medium text-sm'>Logout</span>
                                                    </li>}
                                                </ul>

                                                {/* Divider */}
                                                <div className='my-2 border-t border-gray-200'></div>

                                                {/* Host Actions */}
                                                <ul className='space-y-1'>
                                                    <li onClick={() => navigate("/listingpage1")}
                                                        className='px-4 py-3 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition-colors duration-200 flex items-center gap-3 text-gray-700'>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        <span className='font-medium text-sm'>List your home</span>
                                                    </li>
                                                    <li onClick={() => navigate("/mybooking")}
                                                        className='px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-gray-700 hover:text-gray-900'>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        <span className='font-medium text-sm'>My Booking</span>
                                                    </li>
                                                    <li onClick={() => navigate("/mylisting")}
                                                        className='px-4 py-3 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition-colors duration-200 flex items-center gap-3 text-gray-700 '>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className='font-medium text-sm'>My Listings</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Mobile Search */}
                        <div className='md:hidden pb-4'>
                            <div className='relative'>
                                <input
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                    type="text"
                                    placeholder="Any Where | Any Location | Any City"
                                    className='w-full pl-6 pr-12 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(input);
                                            navigate("/");
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        handleSearch(input);
                                        navigate("/");
                                    }}
                                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full'
                                >
                                    <FaSearch className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* categories section  */}
                <div className='mt-1 w-full h-20 bg-white border-b border-gray-100 sticky top-20 z-40'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full'>
                        <div className='flex items-center lg:justify-center gap-6 h-full overflow-x-auto scrollbar-hide px-2'>
                            {categories.map((category, index) => {
                                const IconComponent = category.icon;
                                const isSelected = selectedCategory === category.name;

                                return (
                                    <div
                                        onClick={() => {
                                            setSelectedCategory(category.name);
                                            if (window.location.pathname !== "/") {
                                                navigate("/");
                                            }
                                        }}
                                        key={index}
                                        className={`
                                                    flex items-center flex-col justify-center 
                                                    cursor-pointer pb-2 min-w-fit 
                                                    transition-all duration-200
                                                    relative
                                                    group
                            ${isSelected ? 'text-pink-600' : 'text-gray-600'}
                        `}
                                    >
                                        {/* Category Icon */}
                                        <div className={`
                            p-2 rounded-full mb-1
                            transition-all duration-200
                            ${isSelected
                                                ? 'bg-pink-50'
                                                : 'group-hover:bg-gray-100'
                                            }
                        `}>
                                            <IconComponent
                                                className={`
                                    w-6 h-6 
                                    transition-colors duration-200
                                    ${isSelected
                                                        ? 'text-pink-600'
                                                        : 'text-gray-500 group-hover:text-gray-800'
                                                    }
                                `}
                                            />
                                        </div>

                                        {/* Category Name */}
                                        <h3
                                            className={`
                                text-sm font-medium whitespace-nowrap 
                                transition-colors duration-200
                                ${isSelected
                                                    ? 'text-pink-600 font-semibold'
                                                    : 'text-gray-600 group-hover:text-gray-800'
                                                }
                            `}
                                        >
                                            {category.name}
                                        </h3>

                                        {/* Bottom Border Indicator */}
                                        <div className={`
                            absolute bottom-0 left-0 right-0 h-0.5 
                            transition-all duration-200
                            ${isSelected
                                                ? 'bg-pink-500 scale-100'
                                                : 'bg-transparent group-hover:bg-gray-300 scale-50'
                                            }
                            ${isSelected ? 'scale-100' : 'group-hover:scale-100'}
                        `} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar