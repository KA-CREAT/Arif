import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('🚀 Dashboard endpoint hit');
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    console.log(`Found ${popularProducts.length} products`);

    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
      select: {
        salesSummaryId: true,
        totalValue: true,
        changePercentage: true,
        date: true
      }
    });
    console.log(`Found ${salesSummary.length} sales summary records`);

    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log(`Found ${purchaseSummary.length} purchase summary records`);

    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log(`Found ${expenseSummary.length} expense summary records`);

    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
      ...item,
      amount: item.amount.toString(),
    }));

    const responseData = {
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    };

    console.log('✅ Sending response data:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('❌ Database Error:', error);
    res.status(500).json({ 
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
};
