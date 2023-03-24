import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import modoRoutes from './routes/v1';
import nextRoutes from './routes/v2';
import errorHandler from './middleware/error.middleware';
import healthCheckRoute from './routes/healthCheck.route';

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

app.use('/health', healthCheckRoute);

// ver1 routes
app.use('/v1', modoRoutes);

app.use(errorHandler);

export default app;
