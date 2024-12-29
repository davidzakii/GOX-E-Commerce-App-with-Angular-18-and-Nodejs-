import express from 'express';
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../handlers/product-handler.js';

const router = express.Router();
router.get('', async (req, res) => {
  try {
    let products = await getProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving products', error });
  }
});
router.get('/:id', async (req, res) => {
  try {
    let product = await getProductById(req.params.id);
    res.send(product.toObject());
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving product', error });
  }
});
router.post('', async (req, res) => {
  try {
    let product = await addProduct(req.body);
    res.status(201).send({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).send({ message: 'Error adding product', error });
  }
});
router.put('/:id', async (req, res) => {
  try {
    await updateProduct(req.params.id, req.body);
    res.send({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error update product failed', error });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Product deleted failed', error });
  }
});
export default router;
