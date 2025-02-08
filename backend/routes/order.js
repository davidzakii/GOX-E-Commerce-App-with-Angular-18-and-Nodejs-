import {
  addOrder,
  getOrderById,
  getOrders,
  updateOrderPaid,
  updateOrderStatus,
} from '../handlers/order-handler.js';
import { isAdmin, verifyToken } from '../middleware/auth-middleware.js';
import orderValidationSchema from '../validation/order-validation-schema.js';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const { error, value } = orderValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    const newOrder = await addOrder(req.user.id, req.body);
    res.status(201).send(newOrder);
  } catch (err) {
    res.status(500).send({ message: 'Failed to create order', error: err });
  }
});

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await getOrders();
    if (orders) {
      res.status(201).send(orders);
    } else {
      res.status(400).send({ error: err, message: 'Failed to retrive orders' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Failed to retrive orders', error: err });
  }
});

router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (order) {
      res.status(201).send(order);
    } else {
      res.status(400).send({ message: 'Failed to retrive order', error: err });
    }
  } catch (err) {
    res.status(500).send({ message: 'Failed to retrive order', error: err });
  }
});

router.patch('/updateStatus/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);
    if (order) {
      res.send(order);
    } else {
      res
        .status(400)
        .send({ message: 'Failed to update order status', error: err });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: 'Server error to update order status', error: err });
  }
});

router.patch('/updatePaid/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await updateOrderPaid(req.params.id, req.body.paid);
    if (order) {
      res.send(order);
    } else {
      res
        .status(400)
        .send({ message: 'Failed to update order paid', error: err });
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Server error to update order paid', error: err });
  }
});

export default router;
