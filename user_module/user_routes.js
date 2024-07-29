import { Router } from "express"
import { signup,signin } from "./user_controllers.js"

const routes = Router() 

routes.post("/signup", signup)
 
routes.post("/signin", signin)

export default routes