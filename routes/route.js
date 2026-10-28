
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/book");

const router = express.Router();

router.post("/api/books", async (req, res) => {
    try {
        const { title, author, category } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ 
                message: "Title is a mandatory fields" });
        }

        const newbook = await Book.create({
            title,
            author,
            category
        });

        res.status(201).json(newbook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/api/books", async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const safePage = page > 0 ? page : 1;
        const safeLimit = limit > 0 ? limit : 10;
        const skip = (safePage - 1) * safeLimit;

        const [books, totalRecords] = await Promise.all([
            Book.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit),

            Book.countDocuments()
        ]);

        res.status(200).json({
            books,
            currentPage: safePage,
            totalRecords,
            totalPages: Math.ceil(totalRecords / safeLimit)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/api/books/:id", async (req, res) => {
    try {
        const { availability } = req.body;
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        if (typeof availability !== "boolean") {
            return res.status(400).json({
                message: "INVALID Availability"
            });
        }

        const book = await Book.findByIdAndUpdate(
            id,
            { availability },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;

