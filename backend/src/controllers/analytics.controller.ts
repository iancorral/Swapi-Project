import { Request, Response } from 'express';
import PostModel from '../models/post.model';
import UserModel from '../models/user.model';

const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalPosts = await PostModel.countDocuments();
        
        const marketValueResult = await PostModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);
        const totalMarketValue = marketValueResult.length > 0 ? marketValueResult[0].total : 0;

        const postsByCategory = await PostModel.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } } 
        ]);

        const userPostCounts = await PostModel.aggregate([
            { $group: { _id: "$author", postCount: { $sum: 1 } } }
        ]);

        let ghosts = 0;    
        let casuals = 0;      
        let powerSellers = 0; 

        userPostCounts.forEach(u => {
            if (u.postCount >= 3) powerSellers++;
            else casuals++;
        });

        ghosts = totalUsers - userPostCounts.length;
        if (ghosts < 0) ghosts = 0; 


        const topSellers = await PostModel.aggregate([
            { $match: { isActive: true } },
            { 
                $group: { 
                    _id: "$author", 
                    totalPosts: { $sum: 1 },
                    totalRevenuePotencial: { $sum: "$price" }
                } 
            },
            { $sort: { totalPosts: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "sellerInfo"
                }
            },
            { $unwind: "$sellerInfo" },
            {
                $project: {
                    _id: 0,
                    name: "$sellerInfo.firstName", // O usa { $concat: ... } si prefieres
                    email: "$sellerInfo.email",
                    posts: "$totalPosts",
                    totalValue: "$totalRevenuePotencial"
                }
            }
        ]);


        // --- Respuesta Final JSON ---
        const responseData = {
            kpis: {
                totalUsers,
                totalPosts,
                totalMarketValue,
                formattedMarketValue: `$${totalMarketValue.toLocaleString()} MXN`
            },
            charts: {
                postsByCategory: postsByCategory.map(item => ({
                    name: item._id, 
                    value: item.count
                })),
                userSegments: [
                    { name: 'Fantasma (0 posts)', value: ghosts },
                    { name: 'Vendedor Casual (1-2)', value: casuals },
                    { name: 'Power Seller (3+)', value: powerSellers }
                ],
                topSellersList: topSellers 
            }
        };

        res.send(responseData);

    } catch (e) {
        res.status(500).send({ error: 'ERROR_GETTING_STATS', details: e });
    }
};

export { getDashboardStats };