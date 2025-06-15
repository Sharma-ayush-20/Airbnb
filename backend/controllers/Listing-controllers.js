import uploadOnCloudinary from "../config/cloudinary.js";
import Listing from '../models/listing-models.js'
import User from '../models/user-models.js'
import mongoose from "mongoose";

const addListing = async (request, response) => {
    try {
        let Host = request.userId;
        let { title, description, Rent, city, landMark, category } = request.body;
        if (!title && !description && !Rent && !city && !landMark && !category) {
            return response.status(400).json({
                message: "Fill All Details Properly!!",
            })
        }
        let image1 = await uploadOnCloudinary(request.files.image1[0].path);
        let image2 = await uploadOnCloudinary(request.files.image2[0].path);
        let image3 = await uploadOnCloudinary(request.files.image3[0].path);
        let listing = await Listing.create(
            { title, description, Rent, city, landMark, category, image1, image2, image3, Host }
        )
        let user = await User.findByIdAndUpdate(Host, { $push: { listing: listing._id } }, { new: true })

        if (!user) {
            response.status(404).json({ message: "User not found" })
        }

        return response.status(200).json({
            listing
        })


    } catch (error) {
        return response.status(500).json({
            message: `Error in addlisting controller -> ${error.message}`,
        })
    }
}

const getListing = async (request, response) => {
    try {
        let allListing = await Listing.find().sort({ createdAt: -1 });//new wali list 1 show hogi and -1 means last
        if (!allListing) {
            return response.status(400).json({
                message: "No Listing Found."
            })
        }
        return response.status(200).json({ allListing })
    } catch (error) {
        console.log("Error in getListing controller -> ", error.message);
    }
}

const findListing = async (request, response) => {
    try {
        const { listId } = request.params;

        if (!listId) {
            return response.status(400).json({ message: "Listing ID is missing." });
        }

        // Check if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(listId)) {
            return response.status(400).json({ message: "Invalid Listing ID format." });
        }

        const particularListingData = await Listing.findById(listId);

        if (!particularListingData) {
            return response.status(404).json({ message: "Listing not found." });
        }

        response.status(200).json(particularListingData);
    } catch (error) {
        console.log("Error in findListing Controller -> ", error);
        response.status(500).json({ message: "Internal Server Error" });
    }
};

const updateListing = async (request, response) => {
    try {
        let { listId } = request.params;
        let { title, description, Rent, city, landMark, category } = request.body;
        if (!title || !description || !Rent || !city || !landMark) {
            return response.status(400).json({
                message: "Please fill all required fields",
            });
        }
        // pahile wala listing check kar 
        const existingListing = await Listing.findById(listId);
        if (!existingListing) {
            return response.status(404).json({ message: "Listing not found" });
        }
        // Handle image uploads - pahile wala image rakho agar naya nahi diya toh
        const image1 = request.files?.image1?.[0]
            ? await uploadOnCloudinary(request.files.image1[0].path)
            : existingListing.image1;

        const image2 = request.files?.image2?.[0]
            ? await uploadOnCloudinary(request.files.image2[0].path)
            : existingListing.image2;

        const image3 = request.files?.image3?.[0]
            ? await uploadOnCloudinary(request.files.image3[0].path)
            : existingListing.image3;


        // Update listing
        const updatedListing = await Listing.findByIdAndUpdate(
            listId,
            {
                title,
                description,
                Rent,
                city,
                landMark,
                image1,
                image2,
                image3
            },
            { new: true } // Return the updated document
        );

        return response.status(200).json({
            message: "Listing updated successfully",
            listing: updatedListing,
        });

    } catch (error) {
        console.error("Error in updateListing Controller:", error);
        return response.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const deleteListing = async (request, response) => {
    try {
        const { listId } = request.params;

        if (!listId || listId === "undefined") {
            return response.status(400).json({
                message: "Listing ID is invalid or missing.",
            });
        }

        //listing delete hui
        const deletedListing = await Listing.findByIdAndDelete(listId);

        if (!deletedListing) {
            return response.status(404).json({
                message: "No listing found with the given ID.",
            });
        }
        //aab user ki host field update karo
        await User.updateOne(
            { listing: listId },
            { $pull: { listing: listId } }
        );

        return response.status(200).json({
            message: "Listing deleted successfully!",
        });

    } catch (error) {
        console.log("Error in deleteListing controller ->", error.message);
        return response.status(500).json({
            message: "Internal Server Error",
        });
    }
}

const search = async (request, response) => {
    try {
        // Query for search
        const { query } = request.query;
        
        if (!query || query.trim() === '') {
            return response.status(400).json({
                message: "Search query is required and cannot be empty.",
            });
        }

        const listing = await Listing.find({
            $or: [
                {
                    landMark: {
                        $regex: query.trim(),
                        $options: "i"
                    }
                },
                {
                    city: {
                        $regex: query.trim(),
                        $options: "i"
                    }
                },
                {
                    title: {
                        $regex: query.trim(),
                        $options: "i"
                    }
                },
            ]
        }).limit(50);

        return response.status(200).json({
            success: true,
            count: listing.length,
            data: listing 
        });
    } catch (error) {
        console.error("Search error: ", error);
        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



export {
    addListing,
    getListing,
    findListing,
    updateListing,
    deleteListing,
    search
};