"use strict";
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
Object.defineProperty(exports, "__esModule", { value: true });
// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// export const register = async (req: Request, res: Response) => {
//     try {
//         const { name, email, password } = req.body;
//         const existingUser = await prisma.users.findFirst({
//             where: { email }
//         });
// // 
//         if (existingUser) {
//             return res.status(400).json({
//                 message: "User with this email already exists"
//             });
//         }
//         const user = await prisma.users.create({
//             data: {
//                 name,
//                 email,
//                 password: await bcrypt.hash(password, 10)
//             },
//             select: {
//                 userId: true,
//                 name: true,
//                 email: true
//             }
//         });
//         res.status(201).json({
//             message: "User created successfully",
//             user
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({
//             message: "Error creating user",
//             error: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// };
// export const login = async (req: Request, res: Response) => {
//     try {
//         const { email, password } = req.body;
//         const user = await prisma.users.findFirst({
//             where: { email },
//             select: {
//                 userId: true,
//                 email: true,
//                 name: true,
//                 hash: true
//             }
//         });
//         if (!user) {
//             return res.status(401).json({
//                 message: "Invalid credentials"
//             });
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.hash);
//         if (!isPasswordValid) {
//             return res.status(401).json({
//                 message: "Invalid credentials"
//             });
//         }
//         const token = jwt.sign(
//             { userId: user.userId, email: user.email },
//             JWT_SECRET,
//             { expiresIn: '24h' }
//         );
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 24 * 60 * 60 * 1000
//         });
//         const { hash: _, ...userWithoutPassword } = user;
//         res.json({
//             message: "Login successful",
//             user: userWithoutPassword
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({
//             message: "Error during login",
//             error: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// }; 
