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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get all products with stock
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.products.findMany({
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
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}));
// Create new order
router.post("/checkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    try {
        // Start transaction
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const sales = [];
            // Create sales records and update stock
            for (const item of items) {
                const product = yield tx.products.findUnique({
                    where: { productId: item.productId }
                });
                if (!product)
                    throw new Error(`Product ${item.productId} not found`);
                if (product.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }
                // Create sale record
                const sale = yield tx.sales.create({
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
                yield tx.products.update({
                    where: { productId: item.productId },
                    data: {
                        stockQuantity: { decrement: item.quantity }
                    }
                });
                sales.push(sale);
            }
            return sales;
        }));
        res.json({ success: true, sales: result });
    }
    catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({
            error: 'Checkout failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
exports.default = router;
