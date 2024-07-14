const Sauce = require("../models/sauce");
const User = require("../models/user"); // Use capital U for model imports
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config({ path: ".env" });

// Get all sauces
exports.getAllSauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).json(sauces);
  } catch (error) {
    res.status(500).json({ message: "Database error!" });
  }
};

// Get one sauce
exports.getOneSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findById(req.params.id);
    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found!" });
    }
    res.status(200).json(sauce);
  } catch (error) {
    res.status(500).json({ message: "Database error!" });
  }
};

// Delete a sauce
exports.deleteSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findById(req.params.id);
    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found!" });
    }

    const filename = sauce.imageUrl.split("/uploads/")[1];
    fs.unlink(path.join("uploads", filename), async (err) => {
      if (err) {
        return res.status(500).json({ message: "File deletion error!" });
      }

      try {
        await Sauce.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Sauce deleted successfully!" });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Database error!" });
  }
};

// Create a sauce
exports.createSauce = async (req, res) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);
    const userId = req.userData.userId;

    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
      userId: userId,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });

    await sauce.save();
    res.status(201).json({ message: "Sauce created successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a sauce
exports.updateSauce = async (req, res, next) => {
  try {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    } : { ...req.body };

    const sauce = await Sauce.findById(req.params.id);

    if (!sauce) {
      return res.status(404).json({ message: 'Sauce not found!' });
    }

    if (sauce.userId.toString() !== req.userData.userId) {
      return res.status(403).json({ message: 'Unauthorized request!' });
    }

    const updateSauceInDatabase = async () => {
      try {
        await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id });
        res.status(200).json({ message: 'Sauce updated successfully!' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };

    if (req.file && sauce.imageUrl) {
      const filename = sauce.imageUrl.split('/uploads/')[1];
      fs.unlink(path.join("uploads", filename), (err) => {
        if (err) {
          console.error('File deletion error:', err);
          return res.status(500).json({ message: 'File deletion error!' });
        }
        updateSauceInDatabase();
      });
    } else {
      updateSauceInDatabase();
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error!' });
  }
};

// Update likes and dislikes for a sauce
exports.likes = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const like = req.body.like;

    const sauce = await Sauce.findById(req.params.id);
    if (!sauce) {
      return res.status(404).json({ message: 'Sauce not found!' });
    }

    // Remove user from both arrays to handle updating like/dislike
    if (sauce.usersLiked.includes(userId)) {
      sauce.usersLiked.pull(userId);
      sauce.likes -= 1;
    }
    if (sauce.usersDisliked.includes(userId)) {
      sauce.usersDisliked.pull(userId);
      sauce.dislikes -= 1;
    }

    // Update arrays and counts based on new like value
    if (like === 1) {
      sauce.usersLiked.push(userId);
      sauce.likes += 1;
    } else if (like === -1) {
      sauce.usersDisliked.push(userId);
      sauce.dislikes += 1;
    }

    await sauce.save();
    res.status(200).json({ message: 'Sauce like status updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Database error!', error });
  }
}
