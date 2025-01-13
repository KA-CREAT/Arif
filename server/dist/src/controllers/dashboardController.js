"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🚀 Dashboard endpoint hit');
    try {
        yield prisma.$connect();
        console.log('✅ Database connected');
        const popularProducts = yield prisma.products.findMany({
            take: 15,
            orderBy: {
                stockQuantity: "desc",
            },
        });
        console.log(`Found ${popularProducts.length} products`);
        const salesSummary = yield prisma.salesSummary.findMany({
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
        const purchaseSummary = yield prisma.purchaseSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        console.log(`Found ${purchaseSummary.length} purchase summary records`);
        const expenseSummary = yield prisma.expenseSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        console.log(`Found ${expenseSummary.length} expense summary records`);
        const expenseByCategorySummaryRaw = yield prisma.expenseByCategory.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => (Object.assign(Object.assign({}, item), { amount: item.amount.toString() })));
        const responseData = {
            popularProducts,
            salesSummary,
            purchaseSummary,
            expenseSummary,
            expenseByCategorySummary,
        };
        console.log('✅ Sending response data:', responseData);
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error('❌ Database Error:', error);
        res.status(500).json({
            error: 'Database error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getDashboardMetrics = getDashboardMetrics;
