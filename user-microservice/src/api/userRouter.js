module.exports = (app, container) => {
  const { schemaValidator } = container.resolve('models')
  const { version } = container.resolve('serverSettings')
  const logger = container.resolve('logger')
  const userRepo = container.resolve('repo')
  const errorCode = container.resolve('errorCode')
  const { getUserToken } = container.resolve('serverHelper')
  app.post(`/api/${version}/user/register`, (req, res) => {
    const newUser = req.body
    schemaValidator(newUser, 'user').then(val => {
      userRepo.addUser(val).then(data => {
        res.json({ status: true, msg: 'user added', user: data })
      }).catch(e => {
        logger.e(e)
        res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
      })
    }).catch(err => {
      res.json({ status: false, msg: err.message, code: errorCode.VALIDATE_ERR })
    })
  })
  app.post(`/api/${version}/user/login`, (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
      return res.send({ status: false, code: errorCode.VALIDATE_ERR })
    }
    userRepo.userLogin({ username, password }).then(user => {
      res.json({ status: true, token: getUserToken(user), user })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
    })
  })
}
