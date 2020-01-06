module.exports = (app, container) => {
  const { schemaValidator } = container.resolve('models')
  const logger = container.resolve('logger')
  const repo = container.resolve('repo')
  const {version} = container.resolve('serverSettings')
  const errorCode = container.resolve('errorCode')
}
