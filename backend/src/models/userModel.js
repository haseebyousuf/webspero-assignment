import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  phone: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  profile: {
    type: String,
    trim: true,
  },
  lat: {
    type: Number,
  },
  lang: {
    type: Number,
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});
UserSchema.index({ location: '2dsphere' });
UserSchema.methods.createHash = async function (password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};
UserSchema.methods.validatePassword = async function (incomingPassword) {
  return await bcrypt.compare(incomingPassword, this.password);
};
export const User = mongoose.model('User', UserSchema);
