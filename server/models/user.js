const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: 'String',
    require: true
  },
  password: {
    type: 'String',
    required: true
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
