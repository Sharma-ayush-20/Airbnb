import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';


function ListingPage1() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { title, setTitle,
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
    } = useContext(AppContext)

    //create a handleImages function to store image file in backend and set image url in frontend
    const handleImage1 = (e) => {
        let file = e.target.files[0]
        setBackEndImage1(file)
        setFrontEndImage1(URL.createObjectURL(file))
    }
    const handleImage2 = (e) => {
        let file = e.target.files[0]
        setBackEndImage2(file)
        setFrontEndImage2(URL.createObjectURL(file))
    }
    const handleImage3 = (e) => {
        let file = e.target.files[0]
        setBackEndImage3(file)
        setFrontEndImage3(URL.createObjectURL(file))
    }

    // Validation function
    const validateForm = () => {
        if (!title.trim()) {
            setError('Property title is required');
            return false;
        }
        if (!description.trim()) {
            setError('Description is required');
            return false;
        }
        if (!backEndImage1) {
            setError('At least one image is required');
            return false;
        }
        if (!rent || rent <= 0) {
            setError('Valid rent amount is required');
            return false;
        }
        if (!city.trim()) {
            setError('City is required');
            return false;
        }
        if (!landMark.trim()) {
            setError('Landmark is required');
            return false;
        }

        setError('');
        return true;
    }

    const handleNext = () => {
        if (validateForm()) {
            navigate("/listingpage2");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Home Button  */}
            <button onClick={() => navigate("/")}
                className="fixed top-4 right-2 sm:top-6 sm:right-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-red-300/20 cursor-pointer">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Home</span>
            </button>

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            List your property
                        </h1>
                        <p className="text-gray-600">
                            Fill in the details to create your listing
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

                    <form className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Property Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                placeholder="Enter a catchy title for your property"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                placeholder="Describe your property, amenities, and what makes it special"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                            />
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Property Images <span className="text-red-500">*</span>
                            </label>
                            {/* Image 1 */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Main Image</label>
                                <div className="relative">
                                    <input
                                        onChange={handleImage1}
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                    />
                                </div>
                            </div>
                            {/* Image 2 */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Second Image</label>
                                <div className="relative">
                                    <input
                                        onChange={handleImage2}
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                    />
                                </div>
                            </div>
                            {/* Image 3 */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Third Image</label>
                                <div className="relative">
                                    <input
                                        onChange={handleImage3}
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rent */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Rent per night <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    ₹
                                </span>
                                <input
                                    value={rent}
                                    onChange={(e) => setRent(e.target.value)}
                                    type="number"
                                    placeholder="2000"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* City and Landmark Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* City */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    type="text"
                                    placeholder="Mumbai"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                            {/* Landmark */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Landmark <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={landMark}
                                    onChange={(e) => setLandMark(e.target.value)}
                                    type="text"
                                    placeholder="Near Gateway of India"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 flex justify-end">
                            <button
                                onClick={handleNext}
                                type="button"
                                className="text-center cursor-pointer w-[30%] bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-red-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ListingPage1
