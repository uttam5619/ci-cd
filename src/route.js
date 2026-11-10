import { Router } from "express"
import { getUser, updateUser, createUser, deleteUser } from "./controller.js"

const router = Router()

router.get('/v1/user/:id', getUser)
router.patch('/v1/user/:id', updateUser)
router.delete('/v1/user/:id', deleteUser)
router.post('./v1/user', createUser)

export default router