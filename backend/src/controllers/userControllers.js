import { User } from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import { signinSchema, signupSchema } from '../validations/userValidation.js';
import { getRandomInRange } from '../utils/utils.js';

export const signup = async (req, res) => {
  try {
    const { success, error } = signupSchema.safeParse(req.body);
    if (!success) {
      const message = error.formErrors.fieldErrors;
      return res.status(400).json({ message });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already taken' });
    }
    const user = new User({
      ...req.body,
      lat: getRandomInRange(30.7, 30.77, 6), // Narrow latitude range for Chandigarh
      lang: getRandomInRange(76.75, 76.8, 6),
    });
    const hashedPassword = await user.createHash(req.body.password);
    user.password = hashedPassword;
    (user.location = {
      type: 'Point',
      coordinates: [user.lang, user.lat], // Longitude first, then latitude
    }),
      await user.save();

    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'User created Successfully', token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Enable to create User', error });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { success } = signinSchema.safeParse({ email, password });
    if (!success) {
      return res.status(400).json({ message: 'Invalid Inputs' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    if (await user.validatePassword(password)) {
      const userId = user._id;
      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } else {
      return res.status(404).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    // const { firstName, lastName, password } = req.body;
    const { success, error } = signupSchema.safeParse(req.body);
    if (!success) {
      const message = error.formErrors.fieldErrors;
      return res.status(400).json({ message });
    }
    const updateFields = req.body;
    if (updateFields.password) {
      const user = await User.findOne({ _id: req.userId });
      const hashedPassword = await user.createHash(updateFields.password);
      updateFields.password = hashedPassword;
    }
    await User.findOneAndUpdate({ _id: req.userId }, updateFields);
    res.status(200).json({ message: 'User updated Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Server Error' });
  }
};

export const getNearbyUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const nearbyUsers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [currentUser.lang, currentUser.lat], // Use the current user's lang and lat
          },
          distanceField: 'distance', // This field will show the distance to each user from the currentUser
          maxDistance: 5000, // Maximum distance in meters
          spherical: true,
          query: { _id: { $ne: currentUser._id } }, // Exclude the current user
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          name: 1, // Include the name field
          profile: 1, // Include the profile field
          email: 1, // Include the email field
          phone: 1, // Include the phone field
          location: 1, // Include the location field
        },
      },
      { $limit: 5 }, // Limit to 5 users
    ]);

    res.status(200).json(nearbyUsers);
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};
