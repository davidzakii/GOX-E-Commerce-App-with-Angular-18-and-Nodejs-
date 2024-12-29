import { Category } from '../db/category.js';

export async function getCategories(req, res) {
  try {
    let category = await Category.find();
    res.send(category);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving categories', error });
  }
}

export async function getCategoryById(req, res) {
  try {
    const categoryId = req.params.id;
    let category = await Category.findById(categoryId);
    res.send(category);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving category' });
  }
}
export async function addCategory(req, res) {
  try {
    let category = await Category.find({ name: req.body.name });
    if (category.length > 0) {
      return res.status(400).send({ message: 'Category already exists' });
    }
    let newCategory = new Category({
      name: req.body.name,
    });
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(500).send({ message: 'Error adding category', error });
  }
}

export async function updateCategory(req, res) {
  try {
    const categoryId = req.params.id;
    await Category.findOneAndUpdate(
      {
        _id: categoryId,
      },
      req.body
    );
    res.send({ message: 'Category updated succeddfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error update category failed', error });
  }
}

export async function deleteCategory(req, res) {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.send({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting category' });
  }
}
