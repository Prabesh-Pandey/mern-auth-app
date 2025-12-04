const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const sendToken = (user, res) => {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return payload;
};

// SIGNUP
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: 'Please provide all required fields' });

        const exist = await User.findOne({ email });
        if (exist) return res.status(409).json({ message: 'User already exists' });

        const hash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hash,
        });

        const payload = sendToken(user, res);
        return res.status(201).json({ message: 'User registered successfully', user: payload });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'Please provide all required fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const payload = sendToken(user, res);
        return res.status(200).json({ message: 'User logged in successfully', user: payload });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// LOGOUT
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    return res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = { register, login, logout };