import { User } from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import {
  signinSchema,
  signupSchema,
  updateSchema,
} from '../validations/userValidation.js';
import { getRandomInRange } from '../utils/utils.js';

//@desc     signup user
//@route    POST /user/signup
//@access   public
export const signup = async (req, res) => {
  try {
    const profile = req.file;
    /* This code block is responsible for handling the signup functionality. */
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
    if (profile) {
      user.profile = profile.filename;
    }
    const hashedPassword = await user.createHash(req.body.password);
    user.password = hashedPassword;
    (user.location = {
      type: 'Point',
      coordinates: [user.lang, user.lat], // Longitude first, then latitude
    }),
      await user.save();

    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    res.status(201).json({
      message: 'User created Successfully',
      user: {
        token,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        zipCode: user.zipCode,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Enable to create User', error });
  }
};

//@desc     signin user
//@route    POST /user/signin
//@access   public
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

      res.status(200).json({
        message: 'Logged in Successfully',
        user: {
          token,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          zipCode: user.zipCode,
          profile: user.profile,
        },
      });
    } else {
      return res.status(404).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

//@desc     update user details
//@route    PUT /user/update
//@access   protected
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, zipCode, phone, mobile } = req.body;
    const profile = req.file;

    const { success, error } = updateSchema.safeParse(req.body);

    if (!success) {
      const message = error.formErrors.fieldErrors;
      return res.status(400).json({ message });
    }
    const updateFields = {
      name,
      email,
      zipCode,
      phone,
      mobile,
    };
    if (profile) {
      updateFields.profile = profile.filename;
    }
    if (password.length > 6) {
      const user = await User.findOne({ _id: req.userId });
      const hashedPassword = await user.createHash(req.body.password);
      updateFields.password = hashedPassword;
    }
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      updateFields,
      { new: true }
    );

    const token = jwt.sign({ userId: req.userId }, process.env.JWT_SECRET);
    res.status(201).json({
      message: 'User Updated Successfully',
      user: {
        token,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        zipCode: user.zipCode,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Server Error' });
  }
};

//@desc     get nearby users
//@route    POST /user/nearby-users
//@access   protected
export const getNearbyUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const nearbyUsers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
          },
          distanceField: 'distance',
          spherical: true,
          query: { _id: { $ne: currentUser._id } },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          profile: 1,
          email: 1,
          phone: 1,
          zipCode: 1,
        },
      },
      { $limit: 5 }, // Limit to 5 users
    ]);

    res.status(200).json(nearbyUsers);
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};
