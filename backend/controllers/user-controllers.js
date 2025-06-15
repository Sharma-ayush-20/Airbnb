import User from "../models/user-models.js";

const getUserData = async (request, response) => {
    try{
        let userData = await User.findById(request.userId).select("-password");
        if(!userData){
            return response.status(400).json({message: "User doesn't found"})
        }
        return response.status(200).json(userData)
    }
    catch(error){
        return response.status(500).json({
            message: `Error in getUserData Controller ${error}`
        })
    }
}

export default getUserData;