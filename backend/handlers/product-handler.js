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
export async function updateProductQuantity(id, orderQuantity) {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  product.quantity -= orderQuantity;
  await product.save();
  return product;
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

export async function addProductReviews(userId, productId, body) {
  const product = await Product.findById(productId);
  const { comment, rating } = body;
  if (!product) return null;
  product.reviews.push({ userId, comment, rating });
  await product.save();
  return product;
}

export async function getProductReviews(productId) {
  const products = await Product.find({ _id: productId });
  const productsWithRatings = products.map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating = product.reviews.length
      ? totalRating / product.reviews.length
      : 0;
    return avgRating;
  });

  return productsWithRatings[0];
}

export async function getProductReviewsUser(productId) {
  const product = await Product.findById(productId).populate(
    'reviews.userId',
    'name'
  );
  if (!product) return null;
  return product.reviews;
}
