import auth from '../middlewares/jwt.js'
import validator from 'express-validator'
import { User } from '../db/connection.js'
import bcrypt from 'bcrypt'
import apiResponse from '../helpers/apiResponse.js'
const body = validator.body
const validationResult = validator.validationResult
// const sanitizeBody = validator.sanitizeBody

export const updateUser = [
  auth,
  body('firstName').optional().isLength({ min: 1 }).trim().withMessage('First name must be defined'),
  body('lastName').optional().isLength({ min: 1 }).trim().withMessage('Last name must be defined'),
  body('password').optional().isLength({ min: 6 }).trim().withMessage('Password must be 6 characters or greater.'),
  body('email').optional().trim().isEmail().withMessage('Email must be a valid email address.').custom(async (value) => {
    const users = await User.findAll({ where: { email: value } })
    if (users.length !== 0) {
      return Promise.reject(new Error('E-mail already in use'))
    }
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      console.log(req.user)
      const user = await User.findOne({ where: { userId: req.user.user_id } })
      if (req.body.firstName !== undefined) user.firstName = req.body.firstName
      if (req.body.lastName !== undefined) user.lastName = req.body.lastName
      if (req.body.email !== undefined) user.email = req.body.email
      if (req.body.password !== undefined) {
        bcrypt.hash(req.body.password, 10).then(hash => { user.hash = hash })
      }
      await user.save()
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
      return apiResponse.successResponseWithData(res, 'Update Success.', userData)
    } catch (err) {

    }
  }]

export const deleteUser = [
  auth,
  body('password').isLength({ min: 6 }).trim().withMessage('Password must be 6 characters or greater.'),
  body('email').trim().isEmail().withMessage('Email must be a valid email address.').custom(async (value) => {
    const user = await User.findOne({ where: { email: value } })
    if (!user) {
      return Promise.reject(new Error('No user with the specified email found'))
    }
  }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
    }
    const user = await User.findOne({ where: { userId: req.user.user_id } })
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
    await user.destroy()
    return apiResponse.successResponseWithData(res, 'User deleted successfully.', userData)
  }
]

export const getUser = [
  auth,
  async (req, res) => {
    try {
      const user = await User.findOne({ where: { userId: req.user.user_id } })
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      return apiResponse.successResponseWithData(res, 'User found successfully', userData)
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }]

export const getUsers = [
  auth,
  async (req, res) => {
    try {
      const i = (Number(req.query.page) - 1) * 10
      if (isNaN(i) || i < 0) return apiResponse.ErrorResponse(res, 'Bad page query input')
      const users = await User.findAll({ offset: i, limit: 10 })
      users.forEach(element => {
        delete element.dataValues.hash
      })
      console.log(users)
      return apiResponse.successResponseWithData(res, 'Users found successfully, page ' + req.query.page, users)
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]
