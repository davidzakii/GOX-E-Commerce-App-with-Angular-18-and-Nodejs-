import Joi from 'joi';

const orderValidationSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(), // Assuming productId is a string
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .required(),
  paymentType: Joi.string().valid('cash', 'paypal', 'stripe').required(),
  totalAmount: Joi.number().required(),
  address: Joi.object({
    address1: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address2: Joi.string().allow(null, ''), // Optional, allow null or empty string
    city: Joi.string().required(),
    postalCode: Joi.number().required(),
  }).required(),
  isPaid: Joi.boolean().default(false).optional(),
  status: Joi.string().valid('Disptched', 'Shipped', 'Delivered').optional(),
});

export default orderValidationSchema;
