import express from 'express';
import {
  getBrands,
  addBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
} from '../handlers/brand-handler.js';

const router = express.Router();
router.get('', (req, res) => {
  getBrands(req, res);
});
router.get('/:id', (req, res) => {
  getBrandById(req, res);
});
router.post('', (req, res) => {
  addBrand(req, res);
});
router.put('/:id', (req, res) => {
  updateBrand(req, res);
});
router.delete('/:id', (req, res) => {
  deleteBrand(req, res);
});
export default router;
