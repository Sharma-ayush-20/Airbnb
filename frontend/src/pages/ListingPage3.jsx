import React, { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import { Carousel } from 'react-responsive-carousel';
import { MapPin, IndianRupee, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";


function ListingPage3() {
  const {
    title,
    description,
    frontEndImage1,
    frontEndImage2,
    frontEndImage3,
    rent,
    city,
    landMark,
    category,
    adding,
    setAdding,
    handleAddListing
  } = useContext(AppContext);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="fixed top-4 left-4 right-4 flex justify-between z-10">
        {/* Back Button */}
        <button onClick={() => navigate("/listingpage2")}
          className="fixed top-4 left-2 sm:top-6 sm:left-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-blue-400/20 cursor-pointer">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Home Button */}
        <button onClick={() => navigate("/")}
          className="fixed top-4 right-2 sm:top-6 sm:right-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-red-300/20 cursor-pointer">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto pt-16 space-y-6">
        {/* Title Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title || "Property Title"}</h1>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="text-red-500 mr-2" />
            <span>{landMark}, {city}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <Tag className="mr-1" size={16} />
              {category || "Category"}
            </span>

            <span className="flex items-center text-xl font-bold">
              <IndianRupee className="mr-1" size={18} />
              {rent || "0"}/month
            </span>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="bg-white p-2 rounded-xl shadow">
          <Carousel
            showArrows={true}
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
          >
            {[frontEndImage1, frontEndImage2, frontEndImage3].map((img, index) => (
              img ? (
                <div key={index}>
                  <img
                    src={img}
                    alt={`Property ${index + 1}`}
                    className="h-64 w-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div key={index} className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">Image {index + 1} not available</span>
                </div>
              )
            ))}
          </Carousel>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About this place</h2>
          <p className="text-gray-600">
            {description || "No description available."}
          </p>
        </div>

        {/* Publish Button */}
        <button
          onClick={() => {
            handleAddListing(); 
            setAdding(true)
          }}
          disabled={adding}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 mb-8 cursor-pointer"
        >
          {adding ? "Adding Listing..."  : "Confirm & Publish Listing" }
        </button>
      </div>
    </div>
  );
}

export default ListingPage3;