import 'dotenv/config';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import connectDB from './config/db';
import UserModel from './models/user.model';
import PostModel from './models/post.model';

const seedDatabase = async () => {
  try {
    // 1. Conectar a la BD
    await connectDB();
    console.log('[seed]: Conectado a la base de datos para poblar.');

    // 2. Limpiar colecciones existentes
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    console.log('[seed]: Base de datos limpiada.');

    // 3. Crear Usuarios de Prueba
    const passwordHash = await hash('123456', 8); // Contraseña para todos: 123456

    const adminUser = await UserModel.create({
      firstName: 'Admin',
      paternalSurname: 'Swapi',
      maternalSurname: 'System',
      email: 'admin@ulsachihuahua.edu.mx',
      password: passwordHash,
      age: 25,
      gender: 'Otro',
      phone: '6140000000',
      role: 'admin',
      isVerified: true
    });

    const studentUser = await UserModel.create({
      firstName: 'Estudiante',
      paternalSurname: 'Prueba',
      email: 'estudiante@ulsachihuahua.edu.mx',
      password: passwordHash,
      age: 21,
      gender: 'Masculino',
      phone: '6141234567',
      role: 'student',
      isVerified: true
    });

    console.log('[seed]: Usuarios creados (Password: 123456)');

    // 4. Crear Publicaciones de Prueba
    const posts = [
      {
        title: 'Calculadora Científica Casio',
        description: 'Calculadora en buen estado, ideal para cálculo integral.',
        price: 350,
        category: 'ventas',
        author: studentUser._id,
        isActive: true,
        images: ['https://placehold.co/600x400/png']
      },
      {
        title: 'Renta de Bata de Laboratorio',
        description: 'Talla M, limpia y planchada. Por día.',
        price: 50,
        category: 'rentas',
        author: studentUser._id,
        isActive: true,
        images: ['https://placehold.co/600x400/png']
      },
      {
        title: 'Asesorías de Programación',
        description: 'Te ayudo con tus proyectos de Java y Python.',
        price: 150,
        category: 'servicios',
        author: adminUser._id, // El admin también puede publicar
        isActive: true,
        images: ['https://placehold.co/600x400/png']
      }
    ];

    await PostModel.insertMany(posts);
    console.log('[seed]: Publicaciones insertadas.');

    console.log('---------------------------------');
    console.log('¡SEED COMPLETADO EXITOSAMENTE!');
    console.log('---------------------------------');
    process.exit(0);

  } catch (error) {
    console.error('[seed]: Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();