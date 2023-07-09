import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser:RequestHandler =async (req,res,next) => {
    const authenticatedUserId = req.session.userId;

    try {
        if(!authenticatedUserId)
            throw createHttpError(401,"User note authenticated");
        
        const user = await UserModel.findById(authenticatedUserId).select("+email").exec(); 
        
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}

interface SignUpBody{
    username?:string,
    email?:string,
    password?:string
}

export const signUp:RequestHandler<unknown,unknown,SignUpBody,unknown> = async (req,res,next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if(!username || !email || !passwordRaw)
            throw createHttpError(400,"Parameters missing");
        
        const existingUserName = await UserModel.findOne({username: username}).exec();
        
        if(existingUserName){
            throw createHttpError(409,"Username already exists. Please choose a different username or loign instead.");
        }

        const existingUserEmail = await UserModel.findOne({email: email}).exec();
        
        if(existingUserEmail){
            throw createHttpError(409,"Email already exists. Please choose a different email or loign instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw,10);

        const newUser =  await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed
        });

        req.session.userId  = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}

interface LoginBody{
    username?:string,
    password?:string
}

export const login:RequestHandler<unknown,unknown, LoginBody,unknown>=async(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;

    try {
        if(!username || !password){
            throw createHttpError(400,"Parameters missing");
        }

        const user = await UserModel.findOne({username:username}).select("+password +email").exec();

        if(!user)
            throw createHttpError(401,"Invalid credentials");
         
        const passwordMatched = await bcrypt.compare(password,user.password);
        
        if(!passwordMatched) 
            throw createHttpError(401,"Invalid credentials");
        
        req.session.userId = user._id;

        res.status(201).json(user);
    } catch (error) {
        next(error)
    }
};