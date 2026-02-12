const express = require("express");
const dotenv = require("dotenv")
const connectDB = require("./src/config/db");

dotenv.config();
app = express();


app.use(express.json());

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})