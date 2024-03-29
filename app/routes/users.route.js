const { findOrder } = require('../controllers/orders.controller.js')

module.exports = (app) => {
  const router = require('express').Router()
  const { verify } = require('../models/middleware.models.js')
  const { create,findAll,findOne,update,deleteOne,login, updatepassword, updatelocation, createEmp,checkSame  } = require('../controllers/users.controller')

  router.post('/', create)

  router.get('/',findAll)

  router.post('/login',login)

  router.get('/:id',findOne)

//   router.post('/number',number)

  router.put('/:id', update)

  router.put('/password/:id', updatepassword)

  router.delete('/:id', deleteOne)
  
  router.put('/location/:id', updatelocation)
  
  router.post('/emp1', createEmp)

  router.get('/checkSame/:user_name',checkSame)


  //เซ็ต PREFIX
  app.use(process.env.PREFIX + '/users', router)
}
