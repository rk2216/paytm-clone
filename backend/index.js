const express = require("express");
const cors = require('cors');
const rootRouter = require("./routes/index");

const app = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors());

app.use(express.json());

app.use('/api/v1', rootRouter);


// Global error handling middleware - MUST be the last app.use()
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(3000, (err) => {
    console.log('App listening to port 3000');
    if(err) {
        console.error(err);
    }
});