
import jwt from 'jsonwebtoken'

//check karo ki user authorized hai ki nhi and fir get karo user-controller.js me
const authMiddlewares = async (request, response, next) => {
    try {
        let {Token} = request.cookies;
        if(!Token){
            return response.status(400).json({
                message: "user doesn't have a token"
            })
        }
        let verifyToken = jwt.verify(Token, process.env.JWT_SECRET_KEY)
        if(!verifyToken){
            return response.status(400).json({
                message: "user doesn't have a valid token"
            })
        }
        request.userId = verifyToken.userId
        next();
        
    } catch (error) {
        return response.status(500).json({
            message: `Error in authMiddlewares ${error}`
        })
    }
}

export default authMiddlewares;