const express = require ("express")
const { deleteUser, followUser, getAllUsers, getUser, removeImages, unFollowUser, updateUser } =require ("../Controllers/UserController.js")


const router = express.Router();
router.get('/:id',getUser)
router.get('/',getAllUsers)

router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', unFollowUser)
router.put('/removeimg/:id',removeImages)


module.exports = router
