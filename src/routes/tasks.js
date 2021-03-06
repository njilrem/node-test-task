import express from 'express'
import { putTask, updateTask, assignTask, deleteTask, getTask, getTasksByStatus, getTasks, getSortedTasksByUsers } from '../controllers/TaskController.js'
const router = express.Router()

router.get('/', getTasks)
router.get('/status', getTasksByStatus)
router.get('/sort', getSortedTasksByUsers)
router.get('/task', getTask)
router.post('/', putTask)
router.patch('/', updateTask)
router.post('/assign', assignTask)
router.delete('/', deleteTask)

export default router
