import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import modoRoutes from './route/v1';
import authRoute from './route/auth.route';
import nextRoutes from './route/v2';
import errorHandler, { APIError } from './middleware/error.middleware';
import healthCheckRoute from './route/healthCheck.route';
import { createConsumer, createProducer } from './service/rabbitmq.service';

const app = express();

const corsOptions = {
  preflightContinue: true,
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  headers: 'Content-Type,X-Auth-Token,authorization,Api-Key',
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

// jwt authentication
// app.use(passport.initialize());
// app.use(fileUpload());
// passport.use('jwt', jwt);
// passport.use('headerapikey',jwtHeaderAuth);

app.use('/v1', modoRoutes);
app.use('/auth', authRoute);

app.use('/health', healthCheckRoute);
app.use('/test', async (req, res, next) => {
  next(new Error('Testing'));
});

// catch-all undefined routes
app.use((req, res, next) => {
  next(new APIError(404, 'Invalid resouce path.'));
});

app.use(errorHandler);

export default app;
