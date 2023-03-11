import express  from "express";
import { deleteUser, followUser, getAllUsers, getUser, removeImages, unFollowUser, updateUser } from "../Controllers/UserController.js";

const router = express.Router();
router.get('/:id',getUser)
router.get('/',getAllUsers)

router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', unFollowUser)
router.put('/removeimg/:id',removeImages)




export default router