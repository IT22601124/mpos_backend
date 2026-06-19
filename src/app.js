import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import backendUserRoutes from './routes/backend_user_route.js';
import roleRoutes from './routes/role_route.js';
import branchRoutes from './routes/branch_route.js';
import categoryRoutes from './routes/category_route.js';
import brandRoutes from './routes/brand_route.js';
import unitRoutes from './routes/unit_route.js';
import supplierRoutes from './routes/supplier_route.js';
import productRoutes from './routes/product_route.js';
import productSupplierRoutes from './routes/product_supplier_route.js';
import stockMovementRoutes from './routes/stock_movement_route.js';
import productBatchRoutes from './routes/product_batch_route.js';
import productImageRoutes from './routes/product_image_route.js';
import taxRoutes from './routes/tax_route.js';
import discountRoutes from './routes/discount_route.js';
import productVariantRoutes from './routes/product_variant_route.js';
import customerRoutes from './routes/customer_route.js';
import customerCreditTransactionRoutes from './routes/customer_credit_transaction_route.js';
import posSaleRoutes from './routes/pos_sale_route.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

const healthHandler = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'mpos-backend'
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);


app.use('/api', backendUserRoutes);
app.use('/api', roleRoutes);
app.use('/api', branchRoutes);
app.use('/api', categoryRoutes);
app.use('/api', brandRoutes);
app.use('/api', unitRoutes);
app.use('/api', supplierRoutes);
app.use('/api', productRoutes);
app.use('/api', productSupplierRoutes);
app.use('/api', stockMovementRoutes);
app.use('/api', productBatchRoutes);
app.use('/api', productImageRoutes);
app.use('/api', taxRoutes);
app.use('/api', discountRoutes);
app.use('/api', productVariantRoutes);
app.use('/api', customerRoutes);
app.use('/api', customerCreditTransactionRoutes);
app.use('/api', posSaleRoutes);

app.use(env.apiPrefix, routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
