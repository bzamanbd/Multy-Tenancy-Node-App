import prisma from "../db_client/prisma_client.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import 'dotenv/config'


export const signup = async(req, res)=>{ 
const {shopName,email,password} = req.body 
const hashedPass = await bcrypt.hash(password, 10) 
try { 
    const oldUser = await prisma.user.findUnique({where:{email}})
    const oldShop = await prisma.shop.findUnique({where:{shopName}})
    if (oldUser) {
        return res.status(401).json({ 
            message:`${email} already in used. Please try with other email`
        })
    }
    if (oldShop) {
        return res.status(401).json({ 
            message:'Shop Name should be unique'
        })
    }
    const user = await prisma.shop.create({ 
        data:{ 
            shopName,
            users:{ 
                create:{ 
                    email,
                    password:hashedPass,
                }
            }
        }
    })
    res.status(201).json({ 
        message:'Registration success',
        user
    })
} catch (e) {
    res.status(500).json({ 
        error:"Something went wrong!", 
        e
    })
}
}

export const signin = async(req,res)=>{ 
    const {email,password} = req.body
    try {
        const user = await prisma.user.findUnique({ where:{email}})
        if (user && bcrypt.compare(password, user.password)) {
            const tocken = jwt.sign({userId:user.id,shopId:user.shopId},process.env.JWT_SECRET,{expiresIn: '30m'}) 
            return res.status(200).json({ 
                message:"Login success!", 
                tocken
            })
        }
        res.status(401).json({ 
            message:"Unauthorized user"
        })        
    } catch (e) {
        res.status(500).json({ 
            error:"Something went wrong!", 
            e
        })
    } 

}