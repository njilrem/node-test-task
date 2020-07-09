import express from 'express'
import { register, login } from '../controllers/AuthController.js'
import { updateUser, deleteUser, getUser, getUsers } from '../controllers/UserController.js'
const router = express.Router()

/* GET users listing. */
router.get('/', getUsers)

router.post('/register', register)
router.post('/login', login)

router.patch('/user', updateUser)
router.delete('/user', deleteUser)
router.get('/user', getUser)

export default router
