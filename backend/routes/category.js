import express from 'express';
import {
  addCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  getCategoryById,
} from '../handlers/category.handler.js';

const router = express.Router();

router.post('', async (req, res) => {
  addCategory(req, res);
});

router.put('/:id', async (req, res) => {
  updateCategory(req, res);
});

router.delete('/:id', async (req, res) => {
  deleteCategory(req, res);
});

router.get('', async (req, res) => {
  getCategories(req, res);
});

router.get('/:id', async (req, res) => {
  getCategoryById(req,res);
});

export default router;
