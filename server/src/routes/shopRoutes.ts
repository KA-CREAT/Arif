import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get all products with stock
router.get("/", async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        stockQuantity: {
          gt: 0
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create new order
router.post("/checkout", async (req, res) => {
  const { items } = req.body;
  
  try {
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const sales = [];
      
      // Create sales records and update stock
      for (const item of items) {
        const product = await tx.products.findUnique({
          where: { productId: item.productId }
        });
        
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        
        // Create sale record
        const sale = await tx.sales.create({
          data: {
            saleId: `SALE-${Date.now()}-${item.productId}`,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            totalAmount: product.price * item.quantity,
            timestamp: new Date(),
          }
        });
        
        // Update stock
        await tx.products.update({
          where: { productId: item.productId },
          data: { 
            stockQuantity: { decrement: item.quantity }
          }
        });
        
        sales.push(sale);
      }
      
      return sales;
    });
    
    res.json({ success: true, sales: result });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      error: 'Checkout failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 