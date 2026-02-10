const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const accountRouter = express.Router();

accountRouter.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const userAccount = await Account.findOne({userId});
    res.json(userAccount.balance);
});

accountRouter.post('/transfer', authMiddleware, async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const userId = req.userId;
    const reqBody = req.body;
    // Fetch the accounts within the transaction
    const senderAccount = await Account.findOne({userId}).session(session);

    const senderBalance = senderAccount.balance;
    const amount = reqBody.amount;

    if(amount > senderBalance) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Insufficient balance"
        });
        return;
    }

    const receiverAccount = await Account.findOne({userId: reqBody.to}).session(session);
    if(!receiverAccount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Invalid account"
        });
        return;
    }

    // Perform the transfer
    await senderAccount.updateOne({$inc: {balance: -amount}}).session(session);
    await receiverAccount.updateOne({$inc: {balance: amount}}).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: "Transfer Successful"
    });
});


export default accountRouter;