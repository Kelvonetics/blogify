import {User} from "../models/User.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { loginSchema, signupSchema } from "../schemas/index.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import {ObjectId} from 'mongodb';
import { Post } from "../models/Post.js";
import crypto from "crypto";


export const checkAuth = async(req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(201).json({
            success: true, message: "Account was created successfully", user
        });
    } catch (error) {
        console.log("Error while checking auth");
        return res.status(400).json({success: false, message: error.message});
    }
}


export const signup = async(req, res) => {
    const { name, email, password, photo } = req.body;
    //return console.log("Form Data : ", req.body);
    //validate with schema
    const { error } = signupSchema.validate({ name, email, password });

    let image;    //return console.log("FORM DATA : ", req.body); 
    if(photo?.length > 12){
        image = photo.substring(12);  //return console.log("Pic URL : ", photo, " ::: ", image);  
    }   

    try {
        if(error){
            return res.status(400).json({
                success: false, message: error.details[0].message
            });
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({success: false, message: "User with email already exist!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            name, email, password: hashedPassword, photo: image, verificationToken
        });

        await user.save();

        //JWT
        generateTokenAndSetCookie(res, user._id);

        // await sendVerificationEmail(user?.email, user?.name, verificationToken)

        res.status(201).json({
            success: true, message: "Account was created successfully", 
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const login = async(req, res) => {
    const { email, password } = req.body;
    //validate with schema
    const { error } = loginSchema.validate({ email, password });

    try {
        
        if(error){
            return res.status(400).json({
                success: false, message: error.details[0].message
            });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({success: false, message: "Invalid  credentials!"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid  credentials!"});
        }


        //JWT
        const token = generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            success: true, message: "Login was successful", 
            user: { token, ...user._doc, password: undefined }
        });
        
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const verifyEmail = async(req, res) => {
    const { verificationCode } = req.body;   //return console.log("CODE :: ", verificationCode);
    try {
        const user = await User.findOne({
            verificationToken: verificationCode,
            // verificationTokenExpiresAt: { $gt: Date.now() }
        });
        if(!user){
            return res.status(400).json({
                success: false, message: "Invalid or expired verification token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        user.save();

        //SEND EMAIL 
        // await sendWelcomeEmail(user.email, user.name);

            res.status(200).json({
            success: true, message: "Email account verified successfully",
            user: { ...user, password: undefined }
        });
        

    } catch (error) {
       res.status(500).json({
        success: false, message: `Server error sending welcome email :  
        ${error.message}`
    }); 
    }
}


export const forgotPassword = async (req, res) => {
	const { email } = req.body;    //return console.log("email :: ", email);
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		// await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email", code: resetToken });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		// await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successfully, redirecting to login page ... " });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const logout = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true, message: "Logout successfully"
    });
}


export const getUsers = async(req, res) => {
    try {
        const users = await User.find()
        .populate({
            path: "likes",
            model: Post,
            select: '_id title body slug photo author'
        });
        
        if(users){
            return res.status(200).json({
                success: true, message: "Users found", data: users
            })
        }
        return res.status(200).json({
            success: false, message: "No user found"
        })
    } catch (error) {
        console.log(error);
    }
}


export const getUser = async(req, res) => {
    const userId = req.params.user_id; 

    const user_id = new ObjectId(userId);  //return console.log("ID : ", user_id)

    try {
        if(!user_id){
            throw new Error('User ID required');
        } 

        const user = await User.findOne({_id: user_id});
        if(!user){
            return res.status(400).json({
                success: false, message: `No user record found`
            });
        }
        res.status(200).json({
            success: true, message: `${user?.name} records found`,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}