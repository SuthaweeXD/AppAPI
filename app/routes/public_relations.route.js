const { PRimages } = require('../models/suprabase.js')


module.exports = (app) => {
  const multer = require('multer')
  const upload = multer()
  const router = require('express').Router()
  const { create,findAll,findOne,update,deleteOne,login,prImages } = require('../controllers/public_relations.controller')

  router.post('/', upload.single('photo'),create)

  router.get('/',findAll)

  router.post('/login',login)

  router.get('/:id',findOne)

//   router.post('/number',number)

  router.put('/:id', update)

  router.delete('/:id', deleteOne)


  router.put('/pr1/:id',upload.single('photo'), prImages)


  //เซ็ต PREFIX
  app.use(process.env.PREFIX + '/public_relations', router)
}
