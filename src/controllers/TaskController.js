import auth from '../middlewares/jwt.js'
import validator from 'express-validator'
import apiResponse from '../helpers/apiResponse.js'
import { Task, User } from '../db/connection.js'
import sequelize from 'sequelize'
const body = validator.body
const validationResult = validator.validationResult

export const putTask = [
  auth,
  body('title').isLength({ min: 1 }).trim().withMessage('Title length must be greater than 1'),
  body('description').isLength({ min: 1 }).trim().withMessage('Description length must be greater than 1'),
  body('status').isIn(['View', 'In progress', 'Done']).withMessage('Wrong status given. Possible are "View", "In progress" or "Done"'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      Task.create(
        {
          title: req.body.title,
          description: req.body.description,
          status: req.body.status,
          userId: req.user.userId
        }
      ).then(task => {
        const taskBody = {
          title: task.title,
          description: task.description,
          status: task.status,
          userId: task.userId
        }
        return apiResponse.successResponseWithData(res, 'Task created successfully', taskBody)
      }).catch(err => {
        console.log(err)
        return apiResponse.ErrorResponse(res, err)
      })
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

export const updateTask = [
  auth,
  body('id').isInt().withMessage('Id must be int').custom(async (value) => {
    const task = await Task.findOne({ where: { id: value } })
    if (!task) {
      return Promise.reject(new Error('No task with the specified id found'))
    }
  }),
  body('title').optional().isLength({ min: 1 }).trim().withMessage('Title length must be greater than 1'),
  body('description').optional().isLength({ min: 1 }).trim().withMessage('Description length must be greater than 1'),
  body('status').optional().trim().isIn(['View', 'In progress', 'Done']).withMessage('Wrong status given. Possible are View, In progress or Done'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      const task = await Task.findOne({ where: { id: req.body.id } })
      if (req.body.title !== undefined) task.title = req.body.title
      if (req.body.description !== undefined) task.description = req.body.description
      if (req.body.status !== undefined) task.status = req.body.status
      await task.save()
      const taskBody = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId
      }
      return apiResponse.successResponseWithData(res, 'Task updated successfully', taskBody)
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

export const assignTask = [
  auth,
  body('id').isInt().withMessage('Id must be int').custom(async (value) => {
    const task = await Task.findOne({ where: { id: value } })
    if (!task) {
      return Promise.reject(new Error('No task with the specified id found'))
    }
  }),
  body('email').trim().isEmail().withMessage('Email must be a valid email address.').custom(async (value) => {
    const user = await User.findOne({ where: { email: value } })
    if (!user) {
      return Promise.reject(new Error('No user with the specified email found'))
    }
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      const user = await User.findOne({ where: { email: req.body.email } })
      const task = await Task.findOne({ where: { id: req.body.id } })
      task.userId = user.userId
      await task.save()
      const taskBody = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId
      }
      return apiResponse.successResponseWithData(res, 'Task assigned successfully', taskBody)
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

export const deleteTask = [
  auth,
  body('id').isInt().withMessage('Id must be int').custom(async (value) => {
    const task = await Task.findOne({ where: { id: value } })
    if (!task) {
      return Promise.reject(new Error('No task with the specified id found'))
    }
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      const task = Task.findOne({ where: { id: req.body.id } })
      const taskBody = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId
      }
      await task.destroy()
      return apiResponse.successResponseWithData(res, 'Task deleted successfully', taskBody)
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

export const getTask = [
  auth,
  body('id').isInt().withMessage('Id must be int').custom(async (value) => {
    const task = await Task.findOne({ where: { id: value } })
    if (!task) {
      return Promise.reject(new Error('No task with the specified id found'))
    }
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      const task = Task.findOne({ where: { id: req.body.id } })
      const taskBody = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId
      }
      return apiResponse.successResponseWithData(res, 'Task deleted successfully', taskBody)
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

export const getTasks = [
  auth,
  async (req, res) => {
    try {
      const tasks = await Task.findAll()
      return apiResponse.successResponseWithData(res, 'All tasks', tasks)
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

export const getTasksByStatus = [
  auth,
  body('status').optional().trim().isIn(['View', 'In progress', 'Done']).withMessage('Wrong status given. Possible are View, In progress or Done'),
  body('date').optional().trim().isDate().withMessage('Not a valid date given'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      if (req.body.date) {
        const tasks = await Task.findAll({ where: { status: req.body.status, createdAt: { [sequelize.Op.lte]: req.body.date } } })
        return apiResponse.successResponseWithData(res, 'Tasks filtered by ' + req.body.status, tasks)
      } else {
        const tasks = await Task.findAll({ where: { status: req.body.status } })
        return apiResponse.successResponseWithData(res, 'Tasks filtered by ' + req.body.status, tasks)
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }
]

export const getSortedTasksByUsers = [
  auth,
  body('sort').isIn(['DESC', 'ASC']).withMessage('Sort must be DESC or ASC'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      const tasks = await Task.findAll({ order: [['userId', req.body.sort]] })
      return apiResponse.successResponseWithData(res, 'Tasks sorted by user registration date in ' + req.body.sort + ' order', tasks)
    } catch (err) {

    }
  }
]
