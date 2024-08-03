const express = require("express");
const router = express.Router();
const Category = require("../models/category.model");

// Get all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ status: true, data: categories });
    } catch (error) {
        res.json({ status: false, error: error });
    }
});

// Add category
router.post("/add", async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
    });
    try {
        const savedCategory = await category.save();
        res.json({ status: true, data: savedCategory });
    } catch (error) {
        res.json({ status: false, error: error });
    }
});
// Edit category
router.put("/update/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
              
            },
            { new: true }
        );
        if (!updatedCategory) {
            return res
                .status(404)
                .json({ status: false, error: "Category not found" });
        }
        res.json({ status: true, data: updatedCategory });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});
// Delete category
router.delete("/delete/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res
                .status(404)
                .json({ status: false, error: "Category not found" });
        }
        res.json({ status: true, data: deletedCategory });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});

module.exports = router;