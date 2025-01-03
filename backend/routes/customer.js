import express from 'express';
import {
  getFeaturedProduct,
  getNewProduct,
  getProductForListing,
  getProducts,
  getProductsByCategoryId,
} from '../handlers/product-handler.js';
import { getCategories } from '../handlers/category.handler.js';
import { getBrands } from '../handlers/brand-handler.js';

const router = express.Router();

router.get('/home/new-products', async (req, res) => {
  let newProducts = await getNewProduct();
  res.send(newProducts);
});

router.get('/home/featured-products', async (req, res) => {
  let newProducts = await getFeaturedProduct();
  res.send(newProducts);
});

router.get('/products/by/category/:categoryId', async (req, res) => {
  let categoryId = req.params.categoryId;
  let products = await getProductsByCategoryId(categoryId);
  res.send(products);
});

router.get('/categories', async (req, res) => {
  getCategories(req, res);
});
router.get('/brands', async (req, res) => {
  getBrands(req, res);
});
router.get('/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Error retriving products', error });
  }
});
router.get('/product', async (req, res) => {
  try {
    const query = req.query;
    console.log(query);
    const products = await getProductForListing(
      query.searchTerm,
      query.categoryId,
      query.brandId,
      query.page,
      query.pageSize,
      query.sortBy,
      query.sortOrder
    );
    if (products) res.send(products);
    else {
      res.send([]);
    }
  } catch (error) {
    res.status(500).send({ message: 'Error retriving products', error });
  }
});

export default router;
