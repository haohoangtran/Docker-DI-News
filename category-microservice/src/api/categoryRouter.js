module.exports = (app, container) => {
  const { schemaValidator } = container.resolve('models')
  const logger = container.resolve('logger')
  const categoryRepo = container.resolve('repo')
  const { version } = container.resolve('serverSettings')
  const errorCode = container.resolve('errorCode')
  app.post(`/api/${version}/category/add`, (req, res) => {
    const newCategory = req.body
    // check user co phai admin khong
    const { user } = req.headers
    if (!user || !user.isAdmin) {
      return res.json({ status: false, code: errorCode.ACCESS_TOKEN_DENIED })
    }
    newCategory.createBy = user._id
    schemaValidator(newCategory, 'category').then(val => {
      categoryRepo.addCategory(val).then(data => {
        res.json({ status: true, category: data })
      }).catch(e => {
        logger.e(e)
        res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
      })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, code: errorCode.VALIDATE_ERR, msg: e.message })
    })
  })
  app.get(`/api/${version}/category/:id`, (req, res) => {
    const { id } = req.params
    categoryRepo.getCategoryById(id).then(data => {
      res.json({ status: true, category: data })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
    })
  })
  app.delete(`/api/${version}/category/:id`, (req, res) => {
    const { id } = req.params
    categoryRepo.deleteCategory(id).then(data => {
      res.json({ status: true, msg: 'thanh cong' })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
    })
  })
}
