import { Request, Response } from 'express';
import PostModel from '../models/post.model';
import UserModel from '../models/user.model';

const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // --- 1. KPIs Generales (Contadores Simples) ---
        // Pregunta de negocio 3: Valor del inventario 
        const totalUsers = await UserModel.countDocuments();
        const totalPosts = await PostModel.countDocuments();
        
        // Sumar el precio de todos los posts activos
        const marketValueResult = await PostModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);
        const totalMarketValue = marketValueResult.length > 0 ? marketValueResult[0].total : 0;


        // --- 2. Distribución por Categoría (Pregunta de Negocio 1) ---
        // [cite: 38] Identificación de patrones
        const postsByCategory = await PostModel.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Ordenar de mayor a menor
        ]);


        // --- 3. Técnica Big Data: Segmentación de Usuarios (Regla de Negocio) ---
        //  Segmentación de usuarios
        // Paso A: Contar cuántos posts tiene cada usuario
        const userPostCounts = await PostModel.aggregate([
            { $group: { _id: "$author", postCount: { $sum: 1 } } }
        ]);

        // Paso B: Clasificar (Algoritmo simple en JS)
        let ghosts = 0;       // 0 posts
        let casuals = 0;      // 1-2 posts
        let powerSellers = 0; // 3+ posts

        // Mapa rápido para saber quién tiene posts
        const activeUserIds = new Set(userPostCounts.map(u => u._id.toString()));
        
        // Iteramos los contadores que encontramos
        userPostCounts.forEach(u => {
            if (u.postCount >= 3) powerSellers++;
            else casuals++;
        });

        // Los que no aparecieron en la lista de posts son "Fantasmas"
        // (Total Usuarios - Usuarios con al menos 1 post)
        ghosts = totalUsers - userPostCounts.length;
        // Ajuste por seguridad (si hay inconsistencias de base de datos)
        if (ghosts < 0) ghosts = 0; 


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
                    name: item._id, // ej: "ventas"
                    value: item.count
                })),
                userSegments: [
                    { name: 'Fantasma (0 posts)', value: ghosts },
                    { name: 'Vendedor Casual (1-2)', value: casuals },
                    { name: 'Power Seller (3+)', value: powerSellers }
                ]
            }
        };

        res.send(responseData);

    } catch (e) {
        res.status(500).send({ error: 'ERROR_GETTING_STATS', details: e }
            
        );
    }
};

export { getDashboardStats };