import { Router } from 'express';
import healthCheckRoute from './healthCheck.route';
import userRoute from './user.route';

const router = Router();

// Modolab FE
const defaultRoutes = [
  {
    path: '/health',
    route: healthCheckRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
