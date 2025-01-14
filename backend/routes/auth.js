import express from 'express';
import { addUser, userLogin } from '../handlers/auth-handler.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    let newUser = await addUser(req.body);
    if (newUser) {
      res.status(201).send({ message: 'user registered' });
    } else {
      res.status(409).send({ message: 'user already exists' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error adding user', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    userLogin(req, res);
  } catch (error) {
    res.status(500).send({ message: 'Error login user', error });
  }
});

export default router;
