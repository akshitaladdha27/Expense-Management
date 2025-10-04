import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      companyId: req.user.companyId,
      _id: { $ne: req.user._id }
    }).select('-password'); 

    res.status(200).json(users);
  } catch (error) {
    console.error(`Error in getAllUsers controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyId: req.user.companyId, 
      managerId: managerId || null, 
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    });

  } catch (error) {
    console.error(`Error in createUser controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};