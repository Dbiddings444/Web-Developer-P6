const Sauce = require("../models/sauce");
const user = require("../models/user");
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config({ path: ".env" });

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      const mappedProducts = sauces.map((sauce) => {
        return sauce;
      });
      res.status(200).json(mappedProducts);
    })
    .catch(() => {
      res.status(500).send(new Error("Database error!"));
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).send(new Error("Sauce not found!"));
      }
      res.status(200).json(sauce);
    })
    .catch(() => {
      res.status(500).send(new Error("Database error!"));
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "Sauce not found!" });
      }

      const filename = sauce.imageUrl.split("/uploads/")[1];

      fs.unlink(path.join( "uploads", filename), (err) => {
        if (err) {
          return res.status(500).json({ error: "File deletion error!" });
        }

        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: "Sauce deleted successfully!" })
          )
          .catch((error) => res.status(400).json({ error: error.message }));
      });
    })
    .catch((error) => res.status(500).json({ error: "Database error!" }));
};


exports.createSauce = (req, res) => {
  // Parse the stringified sauce data
  const sauceObject = JSON.parse(req.body.sauce);
  const userId = req.userData.userId;
  // Construct the sauce object
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`,
    userId: new mongoose.Types.ObjectId(userId),
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "Sauce created successfully!" })
    )
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.updateSauce = (req, res, next) => {
  // Parse the request body to get sauceObject
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  } : { ...req.body };

  // Find the sauce by ID
  Sauce.findById(req.params.id).then(sauce => {
      console.log(sauceObject, "the code got this far");

      if (!sauce) {
          return res.status(404).json({ message: 'Sauce not found!' });
      }

      if (sauce.userId !== req.userData.userId) {
          return res.status(403).json({ message: 'Unauthorized request!' });
      }

      const updateSauceInDatabase = () => {
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Sauce updated successfully!' }))
              .catch(error => res.status(400).json({ error }));
      };

      if (req.file && sauce.imageUrl) {
          console.log(sauceObject, "the code got this far part 3");
          const filename = sauce.imageUrl.split('/uploads/')[1];
          fs.unlink(`uploads/${filename}`, (err) => {
              if (err) {
                  console.error('File deletion error:', err);
                  return res.status(500).json({ error: 'File deletion error!' });
              }
              updateSauceInDatabase();
          });
      } else {
          console.log(sauceObject, "the code got this far part 3");
          updateSauceInDatabase();
      }
  }).catch(error => {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error!' });
  });
};

exports.likes = (req, res, next) => {
  const userId = req.userData.userId;
    const like = req.body.like;

    Sauce.findById(req.params.id).then((sauce) => {
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

        sauce.save()
            .then(() => res.status(200).json({ message: 'Sauce like status updated successfully!' }))
            .catch((error) => res.status(500).json({ message: 'Failed to update sauce like status!', error }));
    }).catch((error) => res.status(500).json({ message: 'Database error!', error }));

  
}
