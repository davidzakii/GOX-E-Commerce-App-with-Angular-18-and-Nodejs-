import express from 'express';
import {
  getFeaturedProduct,
  getNewProduct,
  getProductById,
  getProductForListing,
  getProductReviews,
  addProductReviews,
  getProducts,
  getProductsByCategoryId,
  getProductReviewsUser,
} from '../handlers/product-handler.js';
import {
  getCategories,
  getCategoryById,
} from '../handlers/category.handler.js';
import { getBrandById, getBrands } from '../handlers/brand-handler.js';
import { verifyToken } from '../middleware/auth-middleware.js';
import { getCustomerOrders } from '../handlers/order-handler.js';

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
  try {
    let categoryId = req.params.categoryId;
    let products = await getProductsByCategoryId(categoryId);
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Error retriving products', error });
  }
});

router.get('/categories', async (req, res) => {
  getCategories(req, res);
});
router.get('/categories/:id', async (req, res) => {
  getCategoryById(req, res);
});
router.get('/brands', async (req, res) => {
  getBrands(req, res);
});
router.get('/brands/:id', async (req, res) => {
  getBrandById(req, res);
});
router.get('/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Error retriving products', error });
  }
});
router.get('/products/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.send(product);
  } catch (error) {
    res.status(500).send({ message: 'Error retriving products', error });
  }
});
router.get('/product', async (req, res) => {
  try {
    const query = req.query;
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
router.get('/order', verifyToken, async (req, res) => {
  try {
    const orders = await getCustomerOrders(req.user.id);
    res.status(201).send(orders);
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrive orders' });
  }
});
router.post('/:productId/reviews', verifyToken, async (req, res) => {
  try {
    const product = await addProductReviews(
      req.user.id,
      req.params.productId,
      req.body
    );
    if (product) {
      res.status(201).send(product.reviews);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send({ message: 'Error rating this product', error });
  }
});

router.get('/product/:productId/rating', async (req, res) => {
  try {
    const productsWithRatings = await getProductReviews(req.params.productId);
    res.status(200).send({ totalRating: productsWithRatings });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:productId/reviews', async (req, res) => {
  try {
    const reviews = await getProductReviewsUser(req.params.productId);
    if (reviews) {
      res.status(200).send(reviews);
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error getting users', error });
  }
});

export default router;
