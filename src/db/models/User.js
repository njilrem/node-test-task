const UserModel = (sequilize, DataTypes) => {
  return sequilize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  })
}

export default UserModel
