const express = require('express')
const app = express()
const router = express.Router()

//controlers
const HomeController = require('../controllers/HomeController')
const UsersController = require('../controllers/UsersController')
const auth = require('../middlewares/AdminAuth')


//rotas
router.get('/', HomeController.index)
router.post('/user',  UsersController.create)
router.get('/user',auth, UsersController.index)
router.get('/user/:id', UsersController.findUser)
router.put('/user', UsersController.edit)
router.delete('/user/:id', UsersController.delete)
router.post("/recuperar", UsersController.recuperacao)
router.post('/changepassword', UsersController.changePassword)
router.post('/login',UsersController.login)


module.exports = router