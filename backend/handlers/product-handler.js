import { Product } from '../db/product.js';
import { WishList } from '../db/wishlist.js';

export async function getProducts() {
  let products = await Product.find();
  return products;
}

export async function getProductById(id) {
  let product = await Product.findById(id);
  return product;
}

export async function addProduct(model) {
  let product = new Product({
    ...model,
  });
  await product.save();
  return product;
}
export async function updateProduct(id, model) {
  await Product.findByIdAndUpdate(id, model);
  return;
}
export async function deleteProduct(id) {
  await Product.findByIdAndDelete(id);
  await WishList.updateMany(
    {},
    {
      $pull: {
        products: { productId: { $nin: await Product.distinct('_id') } },
      },
    }
  );
  return;
}

export async function getNewProduct() {
  let newProducts = await Product.find({
    isNewProduct: true,
  });
  return newProducts;
}
export async function getFeaturedProduct() {
  let newProducts = await Product.find({
    isFeatured: true,
  });
  return newProducts;
}

export async function getProductsByCategoryId(id) {
  let newProducts = await Product.find({
    categoryId: id,
  });
  return newProducts;
}

export async function getProductForListing(
  searchTerm,
  categoryId,
  brandId,
  page,
  pageSize,
  sortBy,
  sortOrder
) {
  if (!sortBy) {
    sortBy = 'price';
  }
  if (!sortOrder) {
    sortOrder = -1;
  } else {
    sortOrder = +sortOrder;
  }
  let queryFilter = {};
  if (categoryId) {
    queryFilter.categoryId = categoryId;
  }
  if (searchTerm) {
    queryFilter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { shortDescription: { $regex: searchTerm, $options: 'i' } },
    ];
  }
  if (brandId) {
    queryFilter.brandId = brandId;
  }
  const products = await Product.find(queryFilter)
    .sort({
      [sortBy]: +sortOrder,
    })
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  return products;
}
