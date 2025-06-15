import { useContext, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Card from '../Components/Card'
import { AppContext } from '../Context/AppContext'
import { useLocation } from 'react-router-dom'


function Home() {
    const {
        listingData,
        filteredData,
        searchData,
        selectedCategory,
        clearSearch
    } = useContext(AppContext)
    
    const location = useLocation()

    // Clear search when navigating away from home
    useEffect(() => {
        if (location.pathname !== "/") {
            if (clearSearch) {
                clearSearch();
            }
        }
    }, [location.pathname, clearSearch])

    // Determine which data to display
    const displayData = searchData && searchData.length > 0 
        ? searchData 
        : (filteredData && filteredData.length > 0)
            ? filteredData 
            : listingData || []

    // Determine the title based on current state
    const getTitle = () => {
        if (searchData && searchData.length > 0) {
            return `Search Results (${searchData.length})`;
        }
        return selectedCategory === "Trending" 
            ? "Find Your Perfect Home" 
            : `${selectedCategory} Properties`;
    };

    const getSubtitle = () => {
        if (searchData && searchData.length > 0) {
            return "Properties matching your search";
        }
        return "Discover amazing properties in your favorite locations";
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-red-600 mb-4">
                            {getTitle()}
                        </h1>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            {getSubtitle()}
                        </p>
                    </div>

                    {displayData.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-start min-h-[60vh] px-4">
                            <svg
                                className="w-16 h-16 text-red-500 mb-4 animate-bounce"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-center text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text px-2">
                                {searchData && searchData.length === 0 && searchData !== null
                                    ? "No listings match your search"
                                    : "No listings found in this category"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-800 mt-2 text-center px-4">
                                {searchData && searchData.length === 0 && searchData !== null
                                    ? "Try different search terms"
                                    : "Try selecting a different category"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {displayData.map((list, index) => (
                                <Card
                                    key={list._id || index}
                                    list={list}
                                    ratings={list.ratings}
                                    isBooked={list.isBooked}
                                    host={list.Host}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home
