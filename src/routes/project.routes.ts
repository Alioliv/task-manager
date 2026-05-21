import { Router } from 'express'
import { projectController } from '../controllers/project.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/', projectController.listAll.bind(projectController))
router.get('/owner/:ownerId', projectController.getByOwner.bind(projectController))
router.get('/:id', projectController.getById.bind(projectController))
router.post('/', projectController.create.bind(projectController))
router.put('/:id', projectController.update.bind(projectController))
router.delete('/:id', projectController.delete.bind(projectController))

export { router as projectRouter }