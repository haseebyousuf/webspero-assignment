import { User } from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import { signinSchema, signupSchema } from '../validations/userValidation.js';

export const signup = async (req, res) => {
  try {
    const zod = signupSchema.safeParse(req.body);
    if (!zod.success) {
      return res.status(400).json({ message: 'Invalid Inputs', zod });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already taken' });
    }
    const user = new User({
      ...req.body,
    });
    const hashedPassword = await user.createHash(req.body.password);
    user.password = hashedPassword;
    await user.save();

    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'User created Successfully', token });
  } catch (error) {
    return res.status(409).json({ message: 'Enable to create User', error });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { success } = signinSchema.safeParse({ email, password });
    if (!success) {
      return res.status(411).json({ message: 'Invalid Inputs' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid Credentials' });
    }
    if (await user.validatePassword(password)) {
      const userId = user._id;
      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } else {
      return res.status(404).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};
