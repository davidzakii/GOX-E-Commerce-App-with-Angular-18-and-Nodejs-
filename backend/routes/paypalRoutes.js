import express from 'express';
import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

function paypalClient() {
  return new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    )
  );
}

const router = express.Router();

router.post('/create-payment', async (req, res) => {
  const { amount, currency = 'USD' } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
  });

  try {
    const order = await paypalClient().execute(request);
    res.send({ id: order.result.id });
  } catch (err) {
    res.status(500).send({ message: err.message, error: err });
  }
});

// تنفيذ الدفع بعد موافقة المستخدم
router.post('/capture-payment/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const request = new paypal.orders.OrdersCaptureRequest(orderId);

  try {
    const capture = await paypalClient().execute(request);
    res.send(capture.result);
  } catch (err) {
    res.status(500).send({ error: err, message: err.message });
  }
});

export default router;
