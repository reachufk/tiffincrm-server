import express from 'express'
const router = express.Router();

// const userService = require('../../services/user/user-service');
// import userService from "../../services/user/user-service"
import RegisterUser from '../../services/user/user-service'
import Login from '../../services/user/user-service'
import UpdateUser from '../../services/user/user-service'

router.post('/RegisterUser',RegisterUser)
router.post('/Login',Login);
router.put('/UpdateUser',UpdateUser);

export default router
