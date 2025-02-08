import express from 'express';
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  updateProductQuantity,
} from '../handlers/product-handler.js';
import { getOrdersWithProduct } from '../handlers/order-handler.js';
import productValidationSchema from '../validation/product-validation-schema.js';
import { upload } from '../middleware/fileUpload.js';
import fs from 'fs';
import path from 'path';

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

router.post('', upload.array('images', 5), async (req, res) => {
  // console.log('Request body:', req.body);
  // console.log('file:', req.file);
  const { error, value } = productValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  try {
    const userEmail = req.userEmail;
    if (!userEmail) {
      return res.status(400).send({ message: 'Invalid product data' });
    }

    const imagePaths = req.files.map(
      (file) => `/Products/${userEmail}/${file.filename}`
    );
    const productData = {
      ...req.body,
      images: imagePaths,
    };

    const product = await addProduct(productData);
    res.status(201).send({ message: 'Product added successfully', product });
  } catch (error) {
    const imagePaths = req.files.map(
      (file) => `/Products/${userEmail}/${file.filename}`
    );
    console.log(imagePaths);
    imagePaths.forEach((image) => {
      const imagePath = path.join(process.cwd(), 'public', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
    res.status(500).send({ message: 'Error adding product', error });
  }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const userEmail = req.userEmail;
    if (!userEmail) {
      return res.status(400).send({ message: 'Invalid product data' });
    }

    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        const imagePath = path.join(process.cwd(), 'public', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    const imagePaths = req.files.map(
      (file) => `/Products/${userEmail}/${file.filename}`
    );

    const productData = {
      ...req.body,
      images: imagePaths,
    };
    await updateProduct(req.params.id, productData);
    res.send({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error update product failed', error });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const ordersWithProdyct = await getOrdersWithProduct(req.params.id);
    if (ordersWithProdyct.length > 0) {
      res
        .status(400)
        .send({ message: 'Product is associated with orders, cannot delete' });
    } else {
      const product = await getProductById(req.params.id);
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }

      if (product.images && product.images.length > 0) {
        product.images.forEach((image) => {
          const imagePath = path.join(process.cwd(), 'public', image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
      await deleteProduct(req.params.id);
      res.send({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Product deleted failed', error });
  }
});
router.patch('/:id', async (req, res) => {
  try {
    const quantity = req.body.quantity;
    const id = req.params.id;
    const product = await updateProductQuantity(id, quantity);
    if (product) {
      res
        .status(200)
        .send({ message: 'Updated product quantity successfully', product });
    } else {
      res.status(422).send({ message: 'Invalid product data' });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error edit product quantity', error: error });
  }
});
export default router;
