import { Router } from "express"; 
import userRoutes from '../user_module/user_routes.js'
import productRoutes from '../product_module/product_routes.js' 

const router = Router() 

router.use("/api/users", userRoutes)
router.use("/api/products", productRoutes)

export default router