module.exports = (app, container) => {
  const { schemaValidator } = container.resolve('models')
  const { version } = container.resolve('serverSettings')
  const logger = container.resolve('logger')
  const { postRepo } = container.resolve('repo')
  const errorCode = container.resolve('errorCode')
  app.post(`/api/${version}/post/add`, (req, res) => {
    const newPost = req.body
    if (!req.user) {
      return res.json({ status: false, msg: 'Need token.' })
    }
    newPost.owner = req.user._id
    if (newPost.categories) {
      if (typeof newPost.categories !== typeof []) {
        newPost.categories = [newPost.categories]
      }
    } else {
      newPost.categories = []
    }
    schemaValidator(newPost, 'post').then(val => {
      postRepo.addPost(val).then(data => {
        const { ops, insertedCount, ok } = data
        if (insertedCount === 1) {
          res.json({ status: true, post: ops })
        } else {
          res.json({ status: false, msg: 'insert failed', insertedCount, ok })
        }
      }).catch(e => {
        logger.e(e)
        res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
      })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: e.message, code: errorCode.VALIDATE_ERR })
    })
  })
  app.get(`/api/${version}/post/:id`, (req, res) => {
    const { id } = req.params
    postRepo.getPostById(id).then(data => {
      res.json({ status: true, data })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
    })
  })
  app.get(`/api/${version}/post/getByUser/:id`, (req, res) => {
    const { id } = req.params
    postRepo.getPostByIdUser(id).then(data => {
      res.json({ status: true, data })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
    })
  })
  app.get(`/api/${version}/post/getByCategory/:id`, (req, res) => {
    const { id } = req.params
    postRepo.getPostByIdCategory(id).then(data => {
      res.json({ status: true, data })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
    })
  })
  app.delete(`/api/${version}/post/:id`, (req, res) => {
    const { id } = req.params
    postRepo.deletePost(id).then(() => {
      res.json({ status: true, msg: 'success!' })
    }).catch(e => {
      logger.e(e)
      res.json({ status: false, msg: 'something went wrong.', code: errorCode.DB_ERROR })
    })
  })
}
