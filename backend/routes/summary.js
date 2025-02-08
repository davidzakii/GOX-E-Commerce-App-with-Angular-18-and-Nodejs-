import express from 'express';
import {
  getOrdersSummary,
  getUsersSummary,
} from '../handlers/summary-handler.js';

const router = express.Router();

router.get('/orders', async (req, res) => {
  try {
    const summary = await getOrdersSummary();
    res.send(summary);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Server error when retrive summary', error });
  }
});

router.get('/users', async (req, res) => {
  try {
    const summary = await getUsersSummary();
    res.send(summary);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Server error when retrive summary', error });
  }
});

export default router;
