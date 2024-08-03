const express = require("express");
const router = express.Router();
const Address = require("../models/address.model");

// Add address
router.post("/add", async (req, res) => {
  const { name, phone, street, city, state, postalCode, country, user } =
    req.body;
  // Tạo một đối tượng Address từ dữ liệu nhận được từ req.body
  const address = new Address({
    name: name,
    phone: phone,
    street: street,
    city: city,
    state: state,
    postalCode: postalCode,
    country: country,
    user: user,
  });
  try {
    // Lưu đối tượng Address vào cơ sở dữ liệu
    const savedAddress = await address.save();
    res.json({ status: true, data: savedAddress });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});
// Edit address
router.put('/update/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, phone, street, city, state, postalCode, country } = req.body;

    try {
        // Tìm địa chỉ dựa trên userId và cập nhật thông tin mới
        const updatedAddress = await Address.findOneAndUpdate(
            { user: userId },
            {
                name: name,
                phone: phone,
                street: street,
                city: city,
                state: state,
                postalCode: postalCode,
                country: country,
            },
            { new: true }
        );

        // Kiểm tra nếu không tìm thấy địa chỉ
        if (!updatedAddress) {
            return res.status(404).json({ status: false, error: 'Address not found' });
        }

        // Trả về thông tin của địa chỉ sau khi cập nhật thành công
        res.json({ status: true, data: updatedAddress });
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(400).json({ status: false, error: error.message });
    }
});

// Delete address
router.delete("/delete/:userId", async (req, res) => {
  const { addressId } = req.params;
  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res
        .status(404)
        .json({ status: false, error: "Address not found" });
    }
    res.json({ status: true, data: deletedAddress });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});

// Get address by user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const address = await Address.find({ user: userId });
    if (!address) {
      return res
        .status(404)
        .json({ status: false, error: "Address not found" });
    }
    res.json({ status: true, data: address });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
});

module.exports = router;
