import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import Card from '../Components/Card'
import { useNavigate } from 'react-router-dom'

//userdata me user ki details hai
//filteredData ke andar all listing hai

function MyListing() {
    const { userData, filteredData } = useContext(AppContext) 
    const [listData, setListData] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true) 

    useEffect(() => {
        if (userData && filteredData) {
            const filter = filteredData.filter((item) => item?.Host === userData?._id)
            setListData(filter)
            setLoading(false)
        }
    }, [userData, filteredData])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
             {/* Home Button */}
            <button onClick={() => navigate("/")}
                className="fixed top-4 right-2 sm:top-6 sm:right-6 z-10 flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full sm:rounded shadow-lg hover:shadow-2xl transition-all duration-300 font-medium sm:font-semibold text-sm sm:text-base transform hover:scale-105 backdrop-blur-sm border border-red-300/20 cursor-pointer">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Home</span>
            </button>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-red-600">My Listings</h1>
                    <p className="mt-2 text-lg text-gray-900">
                        {listData.length > 0 
                            ? `You have ${listData.length} properties listed`
                            : "You haven't listed any properties yet"}
                    </p>
                </div>

                {listData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listData.map((listing) => (
                            <Card key={listing._id} list={listing} isBooked={listing.isBooked} host={listing.Host} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No listings found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first listing.</p>
                        <div className="mt-6">
                            <button
                            onClick={() => navigate("/")}
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                New Listing
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyListing