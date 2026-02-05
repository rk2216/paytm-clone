const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const accountRouter = express.Router();

accountRouter.get('/balance', authMiddleware, (req, res) => {
    
});

export default accountRouter;