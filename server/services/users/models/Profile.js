const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  country: { type: String, default: 'US' },
  isDefault: { type: Boolean, default: false },
});

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  addresses: [addressSchema],
  newsletterSubscribed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

profileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
