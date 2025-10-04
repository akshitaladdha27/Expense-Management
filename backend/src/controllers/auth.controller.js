import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import generateToken from '../utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = new Company({
      name: companyName,
      defaultCurrency: 'USD', 
    });
    await newCompany.save();

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'Admin', 
      companyId: newCompany._id,
    });
    await newAdmin.save();

    const token = generateToken(newAdmin._id);
    res.status(201).json({
      token,
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });

  } catch (error) {
    console.error('Error in signup controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error(`Error in login controller: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};