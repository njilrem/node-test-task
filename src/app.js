import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import usersRouter from './routes/users.js'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/users', usersRouter)

export default app
