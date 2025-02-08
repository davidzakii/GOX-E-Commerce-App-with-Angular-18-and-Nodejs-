import Joi from 'joi';
const productValidationSchema = Joi.object({
  name: Joi.string().required(),
  shortDescription: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  discount: Joi.number().required(),
  quantity: Joi.number().required(),
  images: Joi.array().items(Joi.string()).min(0).max(5).optional(),
  categoryId: Joi.string().required(),
  brandId: Joi.string().required(),
  isFeatured: Joi.boolean().default(false).optional(),
  isNewProduct: Joi.boolean().default(false).optional(),
  reviews: Joi.array().items(
    Joi.object({
      userId: Joi.string().required(),
      comment: Joi.string().required(),
      rating: Joi.number().min(0).max(5).required(),
    })
  ),
});

export default productValidationSchema;
