const postSchema = (joi) => ({
  name: joi.string().regex(/^[a-zA-Z0-9'-]+$/i).required(),
  owner: joi.string().required(),
  content: joi.string().min(1).required(),
  title: joi.string().min(1).required(),
  categories: joi.array().items(joi.string()),
  description: joi.string().empty().default(''),
  createTime: joi.string().empty().default(new Date())
})

module.exports = postSchema
