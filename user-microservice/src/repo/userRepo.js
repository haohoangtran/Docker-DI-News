module.exports = function (mongoClient, { serverHelper }) {
  const { encodePassword } = serverHelper
  const userCollection = mongoClient.collection('users')
  // dat username unique
  userCollection.createIndex('username', { unique: true })
  const addUser = (user) => {
    const { username, name, isAdmin, createTime } = user
    const password = encodePassword(user.password)
    return new Promise((resolve, reject) => {
      userCollection.insertOne({ username, name, isAdmin, password, createTime }, (err, data) => {
        if (err) reject(new Error(err))
        else {
          const { result, ops } = data
          if (ops) {

          }
          resolve({ result, ops })
        }
      })
    })
  }
  const userLogin = (user) => {
    const { username } = user
    const password = encodePassword(user.password)
    return new Promise((resolve, reject) => {
      userCollection.findOne({ username, password }, { name: 1, username: 1 }, (err, data) => {
        if (err) reject(new Error(err))
        else {
          const { name, username, createTime, _id } = data
          resolve({ name, username, createTime, _id })
        }
      })
    })
  }
  return { userLogin, addUser }
}
