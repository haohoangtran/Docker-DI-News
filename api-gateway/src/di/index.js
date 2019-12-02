const { createContainer, asValue } = require('awilix')

function initDI ({ serverSettings, dockerSettings, serverHelper }, mediator) {
  mediator.once('init', () => {
    const container = createContainer()
    container.register({
      dockerSettings: asValue(dockerSettings),
      serverSettings: asValue(serverSettings),
      serverHelper: asValue(serverHelper)
    })
    mediator.emit('di.ready', container)
  })
}

module.exports = { initDI }
