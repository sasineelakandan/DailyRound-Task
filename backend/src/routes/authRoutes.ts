import {Router} from 'express'
import { login, logoutUser, verfiyJwt } from '../controller/authController'

const authRoutes=Router()

authRoutes.post('/user-login',login)
authRoutes.post('/verify-jwt',verfiyJwt)
authRoutes.post('/logout-user',logoutUser)




export default authRoutes