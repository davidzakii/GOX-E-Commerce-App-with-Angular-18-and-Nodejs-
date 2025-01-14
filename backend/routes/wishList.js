import express from 'express';
import {
  addProductInWishList,
  createWishList,
  getWishList,
  removeProductFromWishList,
} from '../handlers/wishList-handler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const wishList = await getWishList(req.user.id);
    res.send(wishList);
  } catch (error) {
    res.status(500).send({ message: 'Error retriving wish list', error });
  }
});

router.post('/addProduct/:productId', async (req, res) => {
  try {
    await createWishList(req.user.id);
    const newProductinWishList = await addProductInWishList(
      req.user.id,
      req.params.productId
    );
    if (newProductinWishList) {
      res.send(newProductinWishList);
    } else {
      res.send({ message: 'Product already exist in your wish lists' });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error adding product to wish list', error: error });
  }
});

router.delete('/deleteProduct/:productId', async (req, res) => {
  try {
    const newProductinWishList = await removeProductFromWishList(
      req.user.id,
      req.params.productId
    );
    if (newProductinWishList) {
      res.send(newProductinWishList);
    } else {
      res.send({ message: 'Product not found in your wish lists' });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error delete product to wish list', error });
  }
});

export default router;
