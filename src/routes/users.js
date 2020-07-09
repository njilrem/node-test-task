import express from 'express'
import { register, login } from '../controllers/AuthController.js'
const router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/register', register)
router.post('/login', login)

export default router
