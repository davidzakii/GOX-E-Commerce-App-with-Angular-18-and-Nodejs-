import { User } from '../db/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
  if (!userFound) {
    res.status(404).send({ message: 'user not found' });
  } else {
    const isMatch = await bcrypt.compare(req.body.password, userFound.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          id: userFound._id,
          name: userFound.name,
          email: userFound.email,
          isAdmin: userFound.isAdmin,
        },
        process.env.SECRETKEY,
        { expiresIn: '1h' }
      );
      res.send({
        token,
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
}
