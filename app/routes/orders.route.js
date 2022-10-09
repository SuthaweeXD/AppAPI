module.exports = (app) => {
  const router = require('express').Router()
  const { verifytoken } = require('../models/middleware.models.js')
  const { create,findAll,findOne,update,deleteOne,login, updateStatus } = require('../controllers/orders.controller')

  router.post('/', create)

  router.get('/',findAll)

  router.post('/login',login)

  router.get('/:id',findOne)

//   router.post('/number',number)

  router.put('/:id', update)

  router.delete('/:id', deleteOne)
  router.put('/:id', updateStatus)


  //เซ็ต PREFIX
  app.use(process.env.PREFIX + '/orders', router)
}
