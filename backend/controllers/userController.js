import bcrypt from "bcrypt";
import validator from "validator";
import UserModel from "../models/userModel.js";
import { generateToken, generateRefreshToken, verifyToken } from "../utils/jwtUtils.js";

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(!user) {
            return res.status(401).json({message: "User not found"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(401).json({message: "Invalid password"});
        }
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.status(200).json({
            message: "Login successful", 
            user, 
            token,
            refreshToken,
            expiresIn: '1d'
        });
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user) {
            return res.status(401).json({message: "User already exists"});
        }
        if(!validator.isEmail(email)) {
            return res.status(401).json({message: "Invalid email"});
        }
        if(password.length < 8) {
            return res.status(401).json({message: "Password must be at least 8 characters long"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({name, email, password: hashedPassword});
        await newUser.save();
       const token = generateToken(newUser._id);
       const refreshToken = generateRefreshToken(newUser._id);
       res.status(201).json({
           message: "User created successfully", 
           user: newUser, 
           token,
           refreshToken,
           expiresIn: '1d'
       });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {
        const { valid, decoded, error } = verifyToken(refreshToken);
        
        if (!valid) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Check if it's a refresh token
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ message: "Invalid token type" });
        }

        // Check if user exists
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Generate new tokens
        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            message: "Token refreshed successfully",
            token: newToken,
            refreshToken: newRefreshToken,
            expiresIn: '1d'
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ message: "Token refresh failed" });
    }
};

const adminLogin = async (req, res) => {
    const {email, password} = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = generateToken(process.env.ADMIN_ID);
        const refreshToken = generateRefreshToken(process.env.ADMIN_ID);
        res.status(200).json({
            message: "Admin login successful", 
            token,
            refreshToken,
            expiresIn: '1d'
        });
    } else if(email === process.env.ADMIN_EMAIL && password !== process.env.ADMIN_PASSWORD) {
        res.status(401).json({message: "Invalid password"});
    } else if(email !== process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        res.status(401).json({message: "Invalid email"});
    } else {
        res.status(401).json({message: "Invalid email or password"});
    } 
   
}

export {loginUser, registerUser, refreshToken, adminLogin};