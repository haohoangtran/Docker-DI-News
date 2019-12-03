module.exports = function (mongoClient, options) {
  const { ObjectId } = options

  function createIndex () {
    mongoClient.createCollection('posts', (error) => {
      if (error) {
        return console.error(error)
      }
      mongoClient.collection('posts').createIndex('name', { unique: true })
    })
  }

  createIndex()
  const addPost = (post) => {
    let { categories, owner } = post
    categories = categories.map(i => new ObjectId(i))
    owner = new ObjectId(owner)
    return new Promise((resolve, reject) => {
      post = { ...post, categories, owner }
      mongoClient.collection('posts').insertOne(post, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const removePost = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').remove({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const getPostById = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').findOne({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const getPostByIdUser = (id) => {
    return new Promise((resolve, reject) => {
      const posts = []

      function forEach (p) {
        posts.push(p)
      }

      function cb (err) {
        err ? reject(new Error(err)) : resolve(posts)
      }

      mongoClient.collection('posts').find({ owner: new ObjectId(id) }).forEach(forEach, cb)
    })
  }
  const getPostByIdCategory = (id) => {
    return new Promise((resolve, reject) => {
      const posts = []

      function forEach (p) {
        posts.push(p)
      }

      function cb (err) {
        err ? reject(new Error(err)) : resolve(posts)
      }

      mongoClient.collection('posts').find({ 'categories': { $elemMatch: { $eq: new ObjectId(id) } } }).forEach(forEach, cb)
    })
  }
  const deletePost = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').deleteOne({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const updatePost = (post) => {
    const { id, title, content, categories, description, iduser } = post
    // chi cho update cua minh
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').updateOne({ _id: new ObjectId(id), owner: iduser }, {
        $set: {
          title,
          content,
          categories,
          description
        }
      }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  return { addPost, removePost, getPostById, getPostByIdUser, getPostByIdCategory, deletePost, updatePost }
}
