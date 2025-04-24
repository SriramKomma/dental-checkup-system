const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Dentist = require("../../models/Dentist");

// @route   POST api/dentists/register
// @desc    Register a dentist
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let dentist = await Dentist.findOne({ email });
    if (dentist) {
      return res.status(400).json({ msg: "Dentist already exists" });
    }

    dentist = new Dentist({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    dentist.password = await bcrypt.hash(password, salt);

    await dentist.save();

    const payload = { dentist: { id: dentist.id } };
    jwt.sign(payload, "your_jwt_secret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        dentist: { id: dentist.id, name: dentist.name, email: dentist.email },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
