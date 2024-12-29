import { Brand } from '../db/brand.js';

export async function getBrands(req, res) {
  try {
    let brands = await Brand.find();
    res.send(brands);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving brands', error });
  }
}

export async function getBrandById(req, res) {
  try {
    let brand = await Brand.findById(req.params.id);
    res.send(brand);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving brand', error });
  }
}

export async function addBrand(req, res) {
  try {
    let brand = await Brand.find({ name: req.body.name });
    if (brand.length > 0) {
      return res.status(400).send({ message: 'Brand already exists' });
    }
    let newBrand = new Brand({
      name: req.body.name,
    });
    await newBrand.save();
    res.status(201).send(newBrand);
  } catch (error) {
    res.status(500).send({ message: 'Error adding brand', error });
  }
}

export async function updateBrand(req, res) {
  try {
    const brandId = req.params.id;
    await Brand.findByIdAndUpdate(brandId, req.body);
    res.send({ message: 'Brand updated  successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error update brand failed', error });
  }
}
export async function deleteBrand(req, res) {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.send({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting brand' });
  }
}
