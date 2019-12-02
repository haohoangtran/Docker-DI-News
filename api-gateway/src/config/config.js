const dockerSettings = {
  socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  host: '192.168.2.17'
}

const serverSettings = {
  port: process.env.PORT || 3000,
  shakey: process.env.SHA_KEY || '$123@456,'
}
const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const { shakey } = serverSettings

  function validateToken (token) {
    try {
      return jwt.verify(token, shakey)
    } catch (ex) {
      return null
    }
  }

  return { validateToken }
}
module.exports = { dockerSettings, serverSettings, serverHelper: serverHelper() }