import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routerCategory from './routes/category.js';
import routerBrand from './routes/brand.js';
import routerProduct from './routes/product.js';
import customerRoute from './routes/customer.js';
import authRoute from './routes/auth.js';
import routerWishList from './routes/wishList.js';
import routerCart from './routes/cart.js';
import routreOrder from './routes/order.js';
import routresummary from './routes/summary.js';
import paypalRoute from './routes/paypalRoutes.js';
import { isAdmin, verifyToken } from './middleware/auth-middleware.js';

dotenv.config();
/*
export => we possibol export many function and when import should 
i use object and i use the same 
name in object and in this name should export in file which i import from it
i means 
import {name} from './name'
name should be export in name file
*/

/* 
export default it is one in File
when i use it i use it without object and i possibole use any alias name
*/
const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.static('public/'));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: err.message, error: err });
  }
  if (err) {
    return res.status(400).send({ message: err.message, error: err });
  }
  next();
});

// app.get('/set-cookies', (req, res) => {
//   res.cookie('user', 'JohnDoe', { httpOnly: true, secure: true });
//   res.send('Cookie has been set!');
// });
// app.get('/test-cookies', (req, res) => {
//   console.log('Cookies:', req.cookies);
//   res.send('Check server logs for cookies.');
// });
// app.get('/', (req, res) => {
//   res.send('helloe world');
// });
app.use('/category', verifyToken, isAdmin, routerCategory);
app.use('/brand', verifyToken, isAdmin, routerBrand);
app.use('/product', verifyToken, isAdmin, routerProduct);
app.use('/customer', customerRoute);
app.use('/user', authRoute);
app.use('/wishList', verifyToken, routerWishList);
app.use('/cart', verifyToken, routerCart);
app.use('/order', routreOrder);
app.use('/summary', routresummary);
app.use('/paypal', verifyToken, paypalRoute);

mongoose
  .connect(process.env.MONGODB_LOCAL)
  .then(() => {
    console.log('conected to mongodb');
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
