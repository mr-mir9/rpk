const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())




const apiRouter = express.Router()


// V1: Account
const MainController = require('../controllers/MainController')
apiRouter.post('/login', MainController.login)
apiRouter.post('/calculate', MainController.calculate)
apiRouter.post('/save', MainController.save)
apiRouter.get('/admin', MainController.admin)
apiRouter.put('/admin/user', MainController.editUser)
apiRouter.post('/admin/material', MainController.addMaterial)
apiRouter.put('/admin/material', MainController.editMaterial)
apiRouter.delete('/admin/material/:id', MainController.deleteMaterial)
apiRouter.get('/materials', MainController.getMaterials)


router.use('/api/v1', apiRouter)




module.exports = router