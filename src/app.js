import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import usersRouter from './routes/users.js'
import tasksRouter from './routes/tasks.js'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)

export default app
