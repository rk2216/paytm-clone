const express = require("express");
const cors = require('cors');
const rootRouter = require("./routes/index");

const app = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors());

app.use('/api/v1', rootRouter);