import { User } from '../db/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { generateToken } from '../middleware/auth-middleware.js';

dotenv.config();

export async function addUser(model) {
  let userFound = await User.find({ email: model.email });
  if (userFound.length > 0) {
    return;
  }

  // const saltRounds = 10;
  // let salt1;
  // const salt = await bcrypt.genSalt(saltRounds, (err, salt) => {
  //   if (err) throw err;
  //   salt1 = salt;
  //   console.log(salt);
  // });
  // const hashedPassword = await bcrypt.hash(model.password, salt1);
  const hashedPassword = await bcrypt.hash(model.password, 10);
  let newUser = new User({
    ...model,
    password: hashedPassword,
  });
  await newUser.save();
  return newUser;
}

export async function userLogin(req, res) {
  let userFound = await User.findOne({ email: req.body.email });

  /*
  don't use this way becuase there is gap by email not found
  if (!userFound) {
    res.status(404).send({ message: 'user not found' });
  } else {
    const isMatch = await bcrypt.compare(req.body.password, userFound.password);
    if (isMatch) {
      // const token = jwt.sign(
      //   {
      //     id: userFound._id,
      //     name: userFound.name,
      //     email: userFound.email,
      //     isAdmin: userFound.isAdmin,
      //   },
      //   process.env.SECRETKEY,
      //   { expiresIn: '1h' }
      // );
      res.send({
        token:generateToken(userFound),
        user: {
          id: userFound._id,
          name: userFound.name,
          email: userFound.email,
          isAdmin: userFound.isAdmin,
        },
      });
    } else {
      res.status(400).send({ message: 'password not correct' });
    }
  }
  */

  if (userFound) {
    const isMatch = await bcrypt.compare(req.body.password, userFound.password);
    if (isMatch) {
      const token = generateToken(userFound);
      // console.log('token in userLogin:' + token);
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      });
      res.status(200).send({
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
      });
    } else {
      res.status(400).send({ message: 'Email or password  not correct' });
    }
  } else {
    {
      res.status(400).send({ message: 'Email or password  not correct' });
    }
  }
}

export async function userLogout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  res.status(200).send({ message: 'Logged out successfully' });
}

export async function validateSession(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ valid: false });
  }

  const payload = jwt.verify(token, process.env.SECRETKEY);
  const currentTime = Math.floor(Date.now() / 1000);
  res.status(200).json({ valid: payload.exp > currentTime, user: payload });
}
