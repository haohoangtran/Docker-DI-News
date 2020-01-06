const categorySchema = (joi) => ({
  name: joi.string().regex(/^[a-zA-Z0-9'-]+$/i).required(),
  displayName: joi.string().required(),
  createBy: joi.string().required(),
  description: joi.string().empty().default(''),
  createTime: joi.string().empty().default(new Date())
})

module.exports = categorySchema
