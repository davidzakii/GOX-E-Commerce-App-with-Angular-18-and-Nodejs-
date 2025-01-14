import express from 'express';
import {
  addToCart,
  getCartItems,
  removeFromCart,
} from '../handlers/shopping-cart-handler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const carts = await getCartItems(req.user.id);
    res.send(carts);
  } catch (error) {
    res.status(500).send({ message: 'Error retriving cart', error });
  }
});

router.post('/addtocart/:productId', async (req, res) => {
  try {
    console.log(req.body.quantity);
    await addToCart(req.user.id, req.params.productId, req.body.quantity);
    res.send('Added successfully');
  } catch (error) {
    res.status(500).send({ message: 'Error add to cart', error });
  }
});

router.delete('/deletefromcart/:productId', async (req, res) => {
  try {
    await removeFromCart(req.user.id, req.params.productId);
    res.send('Deleted successfully');
  } catch (error) {
    res.status(500).send({ message: 'Error delete cart', error });
  }
});

export default router;
