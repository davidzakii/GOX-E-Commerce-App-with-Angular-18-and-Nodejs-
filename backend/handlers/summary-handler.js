import { Order } from '../db/order.js';
import { User } from '../db/user.js';

export async function getOrdersSummary() {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        numOrders: 1,
        totalSales: 1,
      },
    },
  ]);
  const orderPaid = await Order.aggregate([
    {
      $match: { isPaid: true },
    },
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        numOrders: 1,
        totalSales: 1,
      },
    },
  ]);
  const orderNoPaid = await Order.aggregate([
    {
      $match: { isPaid: false },
    },
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        numOrders: 1,
        totalSales: 1,
      },
    },
  ]);
  const orderStatusDispatched = await Order.aggregate([
    {
      $match: { status: 'Dispatched' },
    },
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        numOrders: 1,
        totalSales: 1,
      },
    },
  ]);
  const orderStatusShipped = await Order.aggregate([
    {
      $match: { status: 'Shipped' },
    },
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        numOrders: 1,
        totalSales: 1,
      },
    },
  ]);
  const orderStatusDelivered = await Order.aggregate([
    {
      $match: { status: 'Delivered' },
    },
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        numOrders: 1,
        totalSales: 1,
      },
    },
  ]);
  const usersDeliveredOrders = await Order.aggregate([
    {
      $match: { status: 'Delivered' },
    },
    {
      $group: {
        _id: '$userId',
        deliveredOrders: { $sum: 1 },
      },
    },
    {
      $count: 'numUsers',
    },
  ]);
  // const userWithBiggestOrdersQuary = await Order.aggregate([
  //   {
  //     $group: {
  //       _id: '$userId',
  //       totalAmount: { $sum: '$totalAmount' },
  //       address: { $first: '$address' },
  //     },
  //   },
  //   {
  //     $sort: { totalAmount: -1 },
  //   },
  //   {
  //     $limit: 1,
  //   },
  // ]);
  // const userWithBiggestOrders = await User.findById(
  //   userWithBiggestOrdersQuary[0]._id
  // ).select('-_id name email');
  const usersWithOrdersQuary = await Order.aggregate([
    {
      $group: {
        _id: '$userId',
        totalAmount: { $sum: '$totalAmount' },
        address: { $first: '$address' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: '$userDetails',
    },
    {
      $project: {
        _id: 0,
        name: '$userDetails.name',
        email: '$userDetails.email',
        totalAmount: 1,
        address: 1,
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);
  const productWithOrdersQuary = await Order.aggregate([
    {
      $unwind: '$items',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $group: {
        _id: '$items.productId',
        totalQuantity: { $sum: '$items.quantity' },
        totalSales: {
          $sum: {
            $multiply: [
              '$items.quantity',
              {
                $subtract: [
                  '$productDetails.price',
                  {
                    $divide: [
                      {
                        $multiply: [
                          '$productDetails.price',
                          '$productDetails.discount',
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
            ],
          },
        },
        name: { $first: '$productDetails.name' },
      },
    },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        name: 1,
        totalQuantity: 1,
        totalSales: 1,
      },
    },
    {
      $sort: { totalSales: -1 },
    },
  ]);

  return {
    ordersSummary: orders[0],
    orderPaidSummary: orderPaid[0],
    orderNoPaidSummary: orderNoPaid[0],
    orderStatusDispatchedSummary: orderStatusDispatched[0] || 0,
    orderStatusShippedSummary: orderStatusShipped[0] || 0,
    orderStatusDeliveredSummary: orderStatusDelivered[0] || 0,
    usersDeliveredOrders: usersDeliveredOrders[0]?.numUsers || 0,
    // userWithBiggestOrders: {
    //   ...userWithBiggestOrders._doc,
    //   address: userWithBiggestOrdersQuary[0].address,
    //   totalAmount: userWithBiggestOrdersQuary[0].totalAmount,
    // },
    userWithBiggestOrders: usersWithOrdersQuary[0],
    usersWithOrders: usersWithOrdersQuary,
    productWithOrders: productWithOrdersQuary,
  };
}

export async function getUsersSummary() {
  const user = await User.find({}).select('name email');
  return user;
}
