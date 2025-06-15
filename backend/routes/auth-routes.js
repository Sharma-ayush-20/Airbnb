import express from 'express';
import { login, logout, signup } from '../controllers/auth-controllers.js'

const authrouter = express.Router();

authrouter
    .route("/signup")
    .post(signup)

authrouter
    .route("/login")
    .post(login)

authrouter
    .route("/logout")
    .post(logout)

export default authrouter;