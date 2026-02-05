const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

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
    const newAccount = await Account.create({
        userId: newUser._id,
        balance: 1 + Math.random() * 10000
    });
    console.log('Created new account: ', newAccount);
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

userRouter.put('/', authMiddleware, async (req, res) => {
    const UpdateUserInputSchema = z.object({
        password: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional()
    });

    const userId = req.userId;
    const inputValidation = UpdateUserInputSchema.safeParse(req.body);
    if(!inputValidation.success) {
        return res.status(411).json({
            message: "Incorrect inputs " + inputValidation.error
        });
    }

    const input = inputValidation.data;

    try {
        await User.updateOne({_id: userId}, input);
        res.status(200).json({message: "Updated successfully"});
        return;
    } catch (err) {
        console.error("Error occurred while updating user in DB", err);
        res.status(411).json({message: "Error while updating information"});
    }
});

userRouter.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || '';
    const users = await User.find({
            $or: [
                { firstName: {$regex: filter, $options: 'i'}},
                { lastName: {$regex: filter, $options: 'i'}}
            ]
        },
        '_id firstName lastName'
    ).exec();

    res.status(200).json({
        users
    });
});

export default userRouter;