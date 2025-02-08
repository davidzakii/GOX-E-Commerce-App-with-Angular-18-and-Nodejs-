import express from 'express';
import {
  addToCart,
  clearCart,
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
    const cart = await addToCart(
      req.user.id,
      req.params.productId,
      req.body.quantity
    );
    if (cart) res.send({ message: 'Added successfully' });
    else {
      res.send({ message: "we don't have enough quantity" });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error add to cart', error });
  }
});

router.delete('/deletefromcart/:productId', async (req, res) => {
  try {
    await removeFromCart(req.user.id, req.params.productId);
    res.send({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error delete cart', error });
  }
});

router.delete('/', async (req, res) => {
  try {
    await clearCart(req.user.id);
    res.send({ message: 'clear cart successfuly' });
  } catch (error) {
    res.status(500).send({ message: 'Error delete cart', error });
  }
});

export default router;
