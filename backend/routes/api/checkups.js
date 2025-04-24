const express = require("express");
const router = express.Router();
const Checkup = require("../../models/Checkup");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// @route   POST api/checkups/:id/update
// @desc    Update checkup results (upload images and add notes)
// @access  Private (Dentist must be logged in)
router.post("/:id/update", upload.array("images", 5), async (req, res) => {
  const { notes } = req.body;
  const images = req.files.map((file) => file.path);

  try {
    const checkup = await Checkup.findById(req.params.id);
    if (!checkup) {
      return res.status(404).json({ msg: "Checkup not found" });
    }

    checkup.images = images;
    checkup.notes = notes;
    checkup.status = "completed";
    await checkup.save();

    res.json({ msg: "Checkup results updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
