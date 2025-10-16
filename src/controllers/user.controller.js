import { userModel } from "../models/user.model.js"
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt';

export const getAllUser = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const options = {
        page,
        limit,
    };
    let filterUsers = await userModel.paginate({}, options)
    return res.json(filterUsers)
})

export const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await userModel.findById(id)
    if (!user) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(user)
})

export const deleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id
    // const result = await userModel.deleteOne({ _id: userId })
    const result = await userModel.updateOne({ _id: userId }, { isActive: false });
    return res.status(200).json({ message: result })
})

export const updateUesrById = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const result = await userModel.updateOne({ _id: userId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createUser = asyncHandler(async (req, res) => {
    const { fullname, username, role, password } = req.body
    const encrypedPassword = bcrypt.hashSync(password, 10)
       const user = new userModel({
           fullname,
           username,
           role,
           password: encrypedPassword
       })
       await user.save()
       return res.status(200).json(user)
})
