import validator from 'express-validator'
import apiResponse from '../helpers/apiResponse.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/connection.js'
const body = validator.body
const validationResult = validator.validationResult
const sanitizeBody = validator.sanitizeBody

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
export const register = [
  body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
    .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
  body('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.')
    .isEmail().withMessage('Email must be a valid email address.').custom(async (value) => {
      const users = await User.findAll({ where: { email: value } })
      if (users.length !== 0) {
        return Promise.reject(new Error('E-mail already in use'))
      }
    }),
  body('password').isLength({ min: 6 }).trim().withMessage('Password must be 6 characters or greater.'),
  sanitizeBody('firstName').escape(),
  sanitizeBody('lastName').escape(),
  sanitizeBody('email').escape(),
  sanitizeBody('password').escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      } else {
        bcrypt.hash(req.body.password, 10).then(hash => {
          User.create(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              hash: hash
            }
          ).then(user => {
            const userData = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            }
            return apiResponse.successResponseWithData(res, 'Registration Success.', userData)
          }).catch(err => {
            console.error(err)
            return apiResponse.ErrorResponse(res, err)
          })
        })
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }]

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
export const login = [
  body('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.')
    .isEmail().withMessage('Email must be a valid email address.'),
  body('password').isLength({ min: 1 }).trim().withMessage('Password must be specified.'),
  sanitizeBody('email').escape(),
  sanitizeBody('password').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      } else {
        User.findOne({ where: { email: req.body.email } }).then(user => {
          user = user.dataValues
          console.log(user)
          if (user) {
            bcrypt.compare(req.body.password, user.hash).then(same => {
              if (same) {
                const userData = {
                  userId: user.userId,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
                }
                // Prepare JWT token for authentication
                const jwtPayload = userData
                const jwtData = {
                  expiresIn: process.env.JWT_TIMEOUT_DURATION
                }
                const secret = process.env.JWT_SECRET
                // Generated JWT token with Payload and secret.
                userData.token = jwt.sign(jwtPayload, secret, jwtData)
                return apiResponse.successResponseWithData(res, 'Login Success.', userData)
              } else {
                return apiResponse.unauthorizedResponse(res, 'Email or Password wrong.')
              }
            })
          } else {
            return apiResponse.unauthorizedResponse(res, 'Email or Password wrong.')
          }
        })
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }]
