const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// สร้าง Schema ข้อมูลกิจกรรม
const activitySchema = new mongoose.Schema({
    name: String,
    type: String,
    lat: Number,
    lng: Number
});
const Activity = mongoose.model("Activity", activitySchema);

// API ดึงข้อมูลกิจกรรม
app.get("/activities", async (req, res) => {
    const activities = await Activity.find();
    res.json(activities);
});

// API เพิ่มกิจกรรมใหม่
app.post("/activities", async (req, res) => {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
