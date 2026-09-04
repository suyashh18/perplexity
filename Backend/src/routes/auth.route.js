import { Router } from "express"
import { getme, loginHandler, registerController, verifyEmail } from "../controllers/auth.controller.js"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import { identifyUser } from "../middlewares/auth.middleware.js"

const authRouter = Router()

authRouter.post('/register',registerValidator,registerController)

authRouter.get('/verify-email',verifyEmail)

authRouter.post('/login',loginValidator,loginHandler)

authRouter.get('/get-me',identifyUser,getme)


export default authRouter