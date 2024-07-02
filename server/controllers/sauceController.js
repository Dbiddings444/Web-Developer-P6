const Sauce = require("../models/sauce");
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');

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

  // Construct the sauce object
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`,
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

exports.updateAnUserImage = (req, res) => {
	const id = req.params._id;

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	const path = req.file.path.replace(/\\/g, "/")

	User.findByIdAndUpdate(id, req.body = { ProfilePicture: "http://localhost:3000/" + path }, { new: true });
	res.json(updateAnUser);
};

exports.likes = (req, res) => {

}
