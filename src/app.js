import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import backendUserRoutes from './routes/backend_user_route.js';

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

app.use(env.apiPrefix, routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
