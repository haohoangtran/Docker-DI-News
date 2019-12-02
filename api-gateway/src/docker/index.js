'use strict'
const Docker = require('dockerode')

const discoverRoutes = (container) => {
  return new Promise((resolve, reject) => {
    const dockerSettings = container.resolve('dockerSettings')
    const docker = new Docker(dockerSettings)
    const getUpstreamUrl = (serviceDetails) => {
      const { PublicPort } = serviceDetails.Ports[0]
      return `http://${dockerSettings.host}:${PublicPort}`
    }

    const addRoute = (routes, details) => {
      routes[details.Names] = {
        id: details.Id,
        route: details.Labels.apiRouter,
        target: getUpstreamUrl(details)
      }
    }

    docker.listContainers((err, services) => {
      if (err) {
        reject(new Error('an error occured listing containers, err: ' + err))
      }
      const routes = new Proxy({}, {
        get (target, key) {
          console.log(`Get properties from -> "${key}" container`)
          return Reflect.get(target, key)
        },
        set (target, key, value) {
          console.log('Setting properties', key, value)
          return Reflect.set(target, key, value)
        }
      })
      services.forEach((service) => {
        addRoute(routes, service)
      })
      resolve(routes)
    })
  })
}

function test () {
  return new Promise((resolve, reject) => {
    resolve({
      1: {
        id: 1,
        route: '/api/v1/user',
        target: 'http://192.168.2.17:3001'
      },
      2: {
        id: 2,
        route: '/api/v1/post',
        target: 'http://192.168.2.17:3003'
      },
      3: {
        id: 3,
        route: '/api/v1/category',
        target: 'http://192.168.2.17:3002'
      }
    })
  })
}

module.exports = { discoverRoutes:test }
