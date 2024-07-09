const mongoose = require("mongoose");

const SauceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mainPepper: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  heat: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  likes: {
    type: Number,
    default: 0, 
  },
  dislikes: {
    type: Number,
    default: 0, 
  },
  usersLiked: {
    type: [String], 
    default: [],
  },
  usersDisliked: {
    type: [String], 
    default: [],
  },
});

exports.findById = (id) => {
  return new Promise((resolve, reject) =>
    resolve(JSON.parse(JSON.stringify(sauces)).find((sauce) => sauce._id == id))
  );
};
const Sauce = mongoose.model('Sauce', SauceSchema);
module.exports = Sauce;
