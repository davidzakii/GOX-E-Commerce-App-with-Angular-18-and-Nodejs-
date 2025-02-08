import express from 'express';
import {
  addUser,
  userLogin,
  userLogout,
  validateSession,
} from '../handlers/auth-handler.js';

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

router.post('/logout', async (req, res) => {
  try {
    userLogout(req, res);
  } catch (error) {
    res.status(500).send({ message: 'An error occurred during logout', error });
  }
});

router.get('/validate-session', async (req, res) => {
  try {
    validateSession(req, res);
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
