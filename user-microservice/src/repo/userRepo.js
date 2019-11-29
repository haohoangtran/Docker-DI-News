module.exports = function (mongoClient, { serverHelper }) {
  const { encodePassword } = serverHelper

  function createIndex () {
    mongoClient.collection('users').createIndex('username', { unique: true })
  }

  createIndex()
  const addUser = (user) => {
    const { username, name, isAdmin, createTime } = user
    const password = encodePassword(user.password)
    return new Promise((resolve, reject) => {
      mongoClient.collection('users').insertOne({ username, name, isAdmin, password, createTime }, (err, data) => {
        if (err) reject(new Error(err))
        else {
          const { result, ops } = data
          if (result.ok) {
            resolve(ops)
          } else {
            reject(new Error('Không thể thêm user.'))
          }
        }
      })
    })
  }
  const userLogin = (user) => {
    const { username } = user
    const password = encodePassword(user.password)
    return new Promise((resolve, reject) => {
      mongoClient.collection('users').findOne({ username, password }, { name: 1, username: 1 }, (err, data) => {
        if (err) reject(new Error(err))
        else {
          const { name, username, createTime, _id } = data
          const user = { name, username, createTime, _id }
          resolve(user)
        }
      })
    })
  }
  return { userLogin, addUser }
}
