const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { JWT_SECRET } = require("../config");

const userRouter = express.Router()

userRouter.post('/signup', async (req, res) => {
    const SignUpInputSchema = z.object({
        username: z.email().min(3),
        password: z.string().min(6),
        firstName: z.string().max(30),
        password: z.string().max(30),
    });

    const inputValidation = SignUpInputSchema.safeParse(req.body);
    if(!inputValidation.success) {
        return res.status(411).json({
            message: "Incorrect inputs " + inputValidation.error
        });
    }
    const input = inputValidation.data

    const existingUser = await User.findOne({ username: input.username }).exec();
    if(existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        });
    }

    const newUser = await User.create(input);
    const token = jwt.sign({userId: newUser._id}, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token
    });
});

userRouter.post('/signin', async (req, res) => {
    const SignInInputSchema = z.object({
        username: z.email(),
        password: z.string().min(6),
    });

    const inputValidation = SignInInputSchema.safeParse(req.body);
    if(!inputValidation.success) {
        return res.status(411).json({
            message: "Incorrect inputs " + inputValidation.error
        });
    }

    const input = inputValidation.data

    const existingValidUser = await User.findOne(input).exec();
    if(!existingValidUser) {
        res.status(411).json({
            message: "Error while logging in"
        });
        return;
    }

    const token = jwt.sign({username: existingValidUser.username, userId: existingValidUser._id}, JWT_SECRET);

    res.json({
        token
    });
});

export default userRouter;