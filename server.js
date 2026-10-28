const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const router = require("./routes/route");

const app = express();

app.use(express.json());
app.use(router);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(5050, () => {
            console.log("Server running on port 5050");
        });
    })
    .catch(err => console.log(err.message));

