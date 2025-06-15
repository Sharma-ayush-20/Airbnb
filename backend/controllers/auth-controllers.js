
import User from "../models/user-models.js";

const signup = async (request, response) => {
    try {

        const { name, email, password } = request.body;
        const existedEmail = await User.findOne({ email });
        //check karo ki email already present hai kya
        if (existedEmail) {
            return response.status(400).json({
                message: "User is already exist."
            })
        }
        const createdUser = await User.create({
            name, email, password
        })
        //token generate karo
        const token = await createdUser.generateToken();
        //cookie me store karo
        response.cookie("Token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENVIRONMENT === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return response.status(200).json({
            message: "User Created SuccessFully",
            createdUser,
            token: token,
        })

    } catch (error) {
        return response.status(500).json({
            message: `Signup Error ${error}`,
        })
    }
}

const login = async (request, response) => {
    try {

        const { email, password } = request.body;
        const user = await User.findOne({ email });
        //email check kar user ka
        if (!user) {
            return response.status(400).json({
                message: "User doesn't exist. please signup first"
            })
        }
        //password check kar user ka
        const isMatchPassword = await user.comparePassword(password);
        if (!isMatchPassword) {
            return response.status(400).json({
                message: "Incorrect Password"
            })
        }
        //token generate kar
        const token = await user.generateToken();

        //cookie me store karo
        response.cookie("Token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENVIRONMENT === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return response.status(200).json({
            message: "User Login SuccessFully.",
            token: token
        })

    } catch (error) {
        return response.status(500).json({
            message: `Login Error ${error}`,
        })
    }
}

const logout = async (request, response) => {
    try {
        // "Token" cookie ko clear karo
        response.clearCookie("Token", {
            httpOnly: true,
            secure: process.env.NODE_ENVIRONMENT === "production",
            sameSite: "strict"
        });

        return response.status(200).json({
            message: "User logged out successfully."
        });

    } catch (error) {
        return response.status(500).json({
            message: `Logout Error ${error}`,
        })
    }
}


export {
    signup,
    login,
    logout
}