import React, { useContext, useState } from 'react'
import { MdWhatshot, MdVilla, MdPool, MdHome } from 'react-icons/md';
import { GiFarmTractor, GiWoodCabin } from 'react-icons/gi';
import { FaBed, FaBuilding, FaStore } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';


function ListingPage2() {
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

    const navigate = useNavigate();

    const { category, setCategory } = useContext(AppContext)
    const [selectedCategory, setSelectedCategory] = useState('');

    const [error, setError] = useState(''); 

    const validateForm = () => {
        if (!category.trim()) {
            setError("Please select category!")
            return false;
        } else {
            setError("")
            return true;
        }
    }

    const handleNext = () => {
        if (validateForm()) {
            navigate("/listingpage3");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 lg:py-12 px-2 sm:px-4">
            {/* Home Button */}
            <button onClick={() => navigate("/")}
                className="fixed top-4 right-2 sm:top-6 sm:right-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-red-300/20 cursor-pointer">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Home</span>
            </button>

            {/* Back Button */}
            <button onClick={() => navigate("/listingpage1")}
                className="fixed top-4 left-2 sm:top-6 sm:left-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-blue-400/20 cursor-pointer">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back</span>
            </button>

            <div className="max-w-7xl mx-auto pt-16 sm:pt-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 px-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                        Choose Your Category
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Select the type of property you want to list. Pick the category that best describes your space.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-0">
                    {categories.map((category, index) => {
                        const IconComponent = category.icon;
                        const isSelected = selectedCategory === category.name;

                        return (
                            <div
                                onClick={() => { setSelectedCategory(category.name); setCategory(category.name) }}
                                key={index}
                                className={`group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 transform hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 ${isSelected
                                    ? 'bg-gradient-to-br from-pink-50 to-red-50 border-pink-400 ring-2 ring-pink-400 ring-opacity-50'
                                    : 'bg-white border-gray-200 hover:border-pink-300'
                                    }`}
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br rounded-xl sm:rounded-2xl transition-opacity duration-300 ${isSelected
                                    ? 'from-pink-500/10 to-red-500/10 opacity-100'
                                    : 'from-pink-500/5 to-red-500/5 opacity-0 group-hover:opacity-100'
                                    }`}></div>

                                {/* Content */}
                                <div className="relative z-10 text-center">
                                    {/* Icon */}
                                    <div className="mb-3 sm:mb-4 lg:mb-6 flex justify-center">
                                        <div className={`p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 ${isSelected
                                            ? 'bg-gradient-to-br from-pink-200 to-red-200'
                                            : 'bg-gradient-to-br from-pink-100 to-red-100 group-hover:from-pink-200 group-hover:to-red-200'
                                            }`}>
                                            <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 transition-colors duration-300 ${isSelected
                                                ? 'text-red-600'
                                                : 'text-pink-600 group-hover:text-red-600'
                                                }`} />
                                        </div>
                                    </div>

                                    {/* Category Name */}
                                    <h3 className={`text-sm sm:text-base lg:text-xl font-medium sm:font-semibold transition-colors duration-300 leading-tight ${isSelected
                                        ? 'text-gray-900 font-semibold'
                                        : 'text-gray-800 group-hover:text-gray-900'
                                        }`}>
                                        {category.name}
                                    </h3>

                                    {/* Selection Indicator */}
                                    <div className={`mt-2 sm:mt-3 lg:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto transition-all duration-300 ${isSelected
                                        ? 'w-8 sm:w-10 lg:w-12'
                                        : 'w-0 group-hover:w-8 sm:group-hover:w-10 lg:group-hover:w-12'
                                        }`}></div>

                                    {/* Selected Checkmark */}
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full p-1 shadow-lg animate-pulse">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>


                {/* Continue Button */}
                <div className="text-center mt-8 sm:mt-12 px-4">
                    <button
                        onClick={handleNext}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-full cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingPage2
