import jwt from 'express-jwt'
import apiResponse from '../helpers/apiResponse.js'
import conf from 'dotenv'
const config = conf.config()
const secret = process.env.JWT_SECRET

if (config.error) {
  throw new Error('ENV ERROR')
}

const authenticate = [
  jwt({
    secret: secret,
    algorithms: ['HS256']
  }),
  (err, req, res, next) => {
    if (err) return apiResponse.unauthorizedResponse(res, 'No authorization token was found')
  }]

export default authenticate
