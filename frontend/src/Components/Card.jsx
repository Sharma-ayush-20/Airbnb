import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Card({ list, ratings, isBooked, host }) {
  const { title, description, image1, image2, image3, Rent, city, landMark, category } = list;
  // Images array banao
  const images = [image1, image2, image3].filter(img => img);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border border-gray-100 w-full max-w-sm mx-auto">
      {/* Image Section with Carousel */}
      <div className="relative h-48 sm:h-60 overflow-hidden group">
        {isBooked && (
          <div className="absolute top-13 left-2 bg-blue-500 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-red-400/20 ">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              Booked
            </span>
          </div>
        )}



        <img
          src={images[currentImageIndex]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 sm:p-2 rounded-full opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 sm:p-2 rounded-full opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none">
          <div className="flex justify-between items-start p-3 sm:p-4 pointer-events-auto">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <span className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-gray-800 uppercase tracking-wide">
                {category}
              </span>
            </div>

            {/* Image Dots Indicator */}
            {images.length > 1 && (
              <div className="flex space-x-1.5 sm:space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleDotClick(e, index)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${index === currentImageIndex
                      ? 'bg-white scale-125 shadow-lg'
                      : 'bg-white/60 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight flex-1">
            {title}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600">
              ₹{Rent?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              /month
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1 text-[16px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 ">
          <span className="text-yellow-400">⭐</span>
          <span>{ratings}/5</span>
        </div>


        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button onClick={() => navigate(`/view/${list._id}`)}
            className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm">
            View Details
          </button>

        </div>
      </div>
    </div>
  )
}

export default Card
