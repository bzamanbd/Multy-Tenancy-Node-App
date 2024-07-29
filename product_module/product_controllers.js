import prisma from "../db_client/prisma_client.js"

export const createProduct = async (req,res)=>{
    const {name,price} = req.body 
    const shopId = req.user.shopId

    try {
        if (!shopId) {
            return res.status(401).status({ 
                message:"Authorization Required. Please login to create post"
            })
        }

        const product = await prisma.product.create({ 
            data:{ 
                name,
                price,
                shopId,
            }
        })
          res.status(201).json({message:'Product created successfully', product});
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      };

export const fetchProducts = async(req,res)=>{  
    const shopId = req.user.shopId
    try {
        const Products  = await prisma.product.findMany({ 
            where:{
                shopId,
            },
             select:{ 
                id:true,
                name: true,
                price: true,
                shopId: true,
                createdAt: true,
                updatedAt: true,
                shop:{ 
                    select:{ 
                        id:true,
                        shopName:true
                    }
                }
             }
        })
        return res.status(200).json(Products)
    } catch (e) {
        return res.status(500).json({ 
            error:"Something went wrong", 
            e
        })
    }
    
}

// export const viewPost = async (req,res)=>{
//     const postId = req.params.id
//     try {
//         const post = await prisma.post.findUnique({
//             where:{
//             id:Number(postId)
//         }, 
//         select:{ 
//             id:true, 
//             userId:true, 
//             title:true, 
//             description:true, 
//             images:true,
//             videos:true,
//             commentCount:true,
//             createdAt:true, 
//             updatedAt:true, 
//             comment:true 
//         },
//     })
//         if (!post) {
//             return res.status(404).json({ 
//                 message:"Post not found"
//             })
//         }
//         res.status(200).json({ 
//             message:"Post found", 
//             post
//         })
//     } catch (err) {
//         res.status(500).json({ 
//             error:"Something went wrong", 
//             err
//         })
//     }
// }

// export const editPost = async (req,res)=>{  
//     const {title, description, deleteImages, deleteVideos} = req.body 
//     const postId = req.params.id
//     const userId = req.userId
//     try {
//         const imagesToDelete = deleteImages ? deleteImages.split(',').map(Number) : []
//         const videosToDelete = deleteVideos ? deleteVideos.split(',').map(Number) : []

//         if (imagesToDelete.length > 0) {
//             await prisma.image.deleteMany({
//                 where: {
//                     id: { in: imagesToDelete }
//                 }
//             });
//         }

//         if (videosToDelete.length > 0) {
//             await prisma.video.deleteMany({
//                 where: {
//                     id: { in: videosToDelete }
//                 }
//             });
//         }

//         const oldPost = await prisma.post.findUnique({ 
//             where:{
//                 id:Number(postId), 
//                 userId,
//             }
//         })
//         if (!oldPost) {
//             return res.status(404).json({ 
//                 message:"Post not found! You can update only your own post"
//             })
//         }
//         const post = await prisma.post.update({ 
//             where:{ 
//                 id:oldPost.id
//             },
//             data:{ 
//                 title,
//                 description,
//                 images: {
//                 create: req.processedFiles.images
//               }, 
//               videos:{ 
//                 create: req.processedFiles.videos
//               }
//             },
//             include: {
//                 images: true,
//                 videos:true,
//             }
//         })
        
//         res.status(200).json({ 
//             message:"Post is updated successfully", 
//             post
//         })
//     } catch (e) {
//         res.status(500).json({
//             error:"Something went wrong",
//             e
//         })
//     }
// }

// export const deletePost = async (req,res)=>{ 
//     const postId = req.params.id
//     const userId = req.userId
//     try { 
//         const post = await prisma.post.findUnique({ 
//             where:{
//                 id:Number(postId), 
//                 userId,
//             }}) 
//         if (!post) {
//             return res.status(404).json({message:"Post not found"})
//         }
//         await prisma.post.delete({where:{ id:post.id }})
//         return res.status(200).json({ 
//             message:"Post is deleted successfully"
//         })
//     } catch (e) {
//         return res.status(500).json({ error:"Something went wrong"}) 
//     }
// }

// export const searchPost = async(req,res)=>{ 
//     const { query } = req.query
//     if (!query) {
//         return res.status(400).send('Query parameter is required');
//     }
//     try {
//         const posts = await prisma.post.findMany({ 
//             where:{ 
//                 OR: [ 
//                     { title: { contains: query, mode: 'insensitive' } },
//                     { description: { contains: query, mode: 'insensitive' } },
//                 ]
//             },
//             include: {
//                 images: true,
//                 videos: true,
//             },
//         })
//         if (!posts) {
//             return res.status(200).json({ 
//             message:"No post found!", 
//             posts    
//             })
//         }
//         res.status(200).json({ 
//             message:`${posts.length} post found`, 
//             posts
//         })
        
//     } catch (e) {
//         return res.status(500).json({ 
//             error:"Something went wrong", 
//             e
//         })
//     }
// }