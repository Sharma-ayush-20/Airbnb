import express from 'express';
const userRoutes = express.Router();
import getUserData from '../controllers/user-controllers.js';
import authMiddlewares from '../middlewares/auth-middlewares.js';

userRoutes.route("/currentuser").get(authMiddlewares, getUserData)

export default userRoutes;