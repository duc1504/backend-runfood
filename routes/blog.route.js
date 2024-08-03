const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.model');

// Route để lấy danh sách các bài viết
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ status: true, data: blogs });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi lấy danh sách bài viết', error });
    }
});

// Route để lấy chi tiết một bài viết
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ status: false, message: 'Bài viết không tồn tại' });
        }
        res.status(200).json({ status: true, data: blog });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi lấy chi tiết bài viết', error });
    }
});

// Route để thêm bài viết mới
router.post('/', async (req, res) => {
    const { title, image, content, excerpt, author } = req.body;

    try {
        const newBlog = new Blog({
            title,
            image,
            content,
            excerpt,
            author,
        });
        await newBlog.save();
        res.status(201).json({ status: true, message: 'Bài viết đã được thêm', data: newBlog });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi thêm bài viết mới', error });
    }
});

// Route để cập nhật một bài viết
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, image, content, excerpt, author } = req.body;

    try {
        const blog = await Blog.findByIdAndUpdate(id, {
            title,
            image,
            content,
            excerpt,
            author,
        }, { new: true });

        if (!blog) {
            return res.status(404).json({ status: false, message: 'Bài viết không tồn tại' });
        }

        res.status(200).json({ status: true, message: 'Bài viết đã được cập nhật', data: blog });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi cập nhật bài viết', error });
    }
});

// Route để xóa một bài viết
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ status: false, message: 'Bài viết không tồn tại' });
        }

        res.status(200).json({ status: true, message: 'Bài viết đã được xóa' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Đã xảy ra lỗi khi xóa bài viết', error });
    }
});

module.exports = router;
