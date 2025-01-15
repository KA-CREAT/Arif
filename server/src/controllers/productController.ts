import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get products with optional search
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};


export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params; 

    const product = await prisma.products.delete({
      where: { productId }, 
     });
     console.log(productId)
     res.status(201).json({ message: "", product });
  } catch (error: unknown) { 
      if (error instanceof Error) {
      if ((error as unknown as { code: unknown }).code === "P2025") {
        res.status(404).json({ message: "Product not found" });
      } 
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }
};



