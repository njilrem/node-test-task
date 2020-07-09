import Sequelize from 'sequelize'
import UserModel from './models/User.js'
import TaskModel from './models/Task.js'

const connection = new Sequelize('tasktracker', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})

const setUpConnection = async () => {
  try {
    await connection.authenticate()
    console.log('Connection has been established successfully.')
    await connection.sync()
    console.log('All models were synchronized successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

const User = UserModel(connection, Sequelize.DataTypes)
const Task = TaskModel(connection, Sequelize.DataTypes)

export { setUpConnection, User, Task }
