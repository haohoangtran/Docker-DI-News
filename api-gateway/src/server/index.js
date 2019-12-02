'use strict'
const express = require('express')
const proxy = require('http-proxy-middleware')

const start = (container) => {
  return new Promise((resolve, reject) => {
    const { port } = container.resolve('serverSettings')
    const routes = container.resolve('routes')
    const { validateToken } = container.resolve('serverHelper')

    if (!routes) {
      reject(new Error('The server must be started with routes discovered'))
    }
    if (!port) {
      reject(new Error('The server must be started with an available port'))
    }

    const app = express()
    for (let key in routes) {
      const { route, target } = routes[key]
      if (route) {
        app.use(route, proxy({
          target,
          changeOrigin: true,
          logLevel: 'debug',
          onProxyReq (proxyReq, req, res) {
            // add custom header to request
            if (req.headers.token) {
              let user = validateToken(req.headers.token)
              if (user) {
                proxyReq.setHeader('user', encodeURI(JSON.stringify(user)))
              }
            }
          }
        }))
      }
    }
    const server = app.listen(port, () => resolve(server))
  })
}

module.exports = { start }
