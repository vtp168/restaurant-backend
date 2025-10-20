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

export const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { password, ...rest } = req.body

  try {
    // If password is provided, hash it
    if (password && password.trim() !== '') {
      rest.password = bcrypt.hashSync(password, 10)
    }

    // Update and return the updated user
    const updatedUser = await userModel.findByIdAndUpdate(id, rest, {
      new: true, // return updated document
      runValidators: true, // validate before saving
    })

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to update user', error })
  }
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

export const updateProfile = async (req, res) => {
  const user = await userModel.findById(req.user.id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  const { fullname, oldPassword, password } = req.body

  // Check old password
  const match = await bcrypt.compare(oldPassword, user.password)
  if (!match) return res.status(400).json({ message: 'Old password is incorrect' })

  user.fullname = fullname || user.fullname

  // Update password if provided
  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  await user.save()
  res.status(200).json({ message: 'Profile updated successfully' })
}
