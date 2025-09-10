import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {userModel} from '../models/user.model.js'



export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({ username: username })
    if (!user) {
        return res.status(400).json({ message: "Username or Password Incorrect!"})
    }
    const isMatched = await bcrypt.compare(password, user.password);
    console.log(user.password);
    console.log(isMatched);
    if (!isMatched) {
        return res.status(400).json({ message: "Username or Password Incorrect!"})
    }
    // JWT
    const payload = {
        _id: user._id,
        username: user.username,
        role: user.role
    }
    const token = jwt.sign(
        payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })
    return res.status(200).json({ accessToken: token,user: payload })

    // return res.status(400).json({ message: 'Invalid credential' })
})

export const register= asyncHandler(async (req, res) => {
    const { name, username, role, age, email, password } = req.body
    const encrypedPassword = bcrypt.hashSync(password, 10)
    const user = new userModel({
        name,
        username,
        role,
        email,
        password: encrypedPassword
    })
    await user.save()
    return res.json(user)
})