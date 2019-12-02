const dockerSettings = {
  socketPath: process.env.SOCKET_PATH || '/var/run/docker.sock'
}
const serverSettings = {
  port: process.env.PORT || 3000,
  shakey: process.env.SHA_KEY || 'hihihaha%$%!#@!'
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

module.exports = { serverSettings, dockerSettings, serverHelper: serverHelper() }
