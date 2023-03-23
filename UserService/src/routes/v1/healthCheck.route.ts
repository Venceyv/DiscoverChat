import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'Up 💪 and Running 🔥',
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error: unknown) {
    if (error instanceof Error) {
      healthcheck.message = `Server down: ${error.message}`;
    }
    healthcheck.message = 'Server down: error not instanceof Error';
    res.status(503).send();
  }
});

export default router;
