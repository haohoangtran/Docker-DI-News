const { createContainer, asValue } = require('awilix')

const initDI = ({ dbSettings, serverSettings, errorCode, logger, repo, models, serverHelper }, mediator) => {
  console.log('init DI')
  const container = createContainer()
  container.register({
    repo: asValue(repo),
    dbSettings: asValue(dbSettings),
    models: asValue(models),
    serverSettings: asValue(serverSettings),
    errorCode: asValue(errorCode),
    logger: asValue(logger),
    serverHelper: asValue(serverHelper)
  })
  mediator.emit('di.ready', container)
}

module.exports = { initDI }
