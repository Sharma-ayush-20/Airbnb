import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
    }
},
    {
        timestamps: true,
    }
)

//password ko encrypt karna (hashing)
userSchema.pre("save", async function (next) {

    const user = this;
    //agar mera password modified hoga toh hash karna password
    if (!user.isModified("password")) {
        return next();
    }

    try {
        const saltRound = 10;
        const hashPassword = await bcrypt.hash(user.password, saltRound);
        user.password = hashPassword;
        next();
    } catch (error) {
        console.log("Error Occurred at hash password", error.message)
    }

})

//compare password -> hash aur user password ko compare karo
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

//token ko generate karne ke liye function
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        )
    } catch (error) {
        console.log("Error Occured at generating token", error);
        return null;
    }
}

const User = new mongoose.model("User", userSchema);
export default User;
