import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.SECRETKEY,
    {
      expiresIn: '10d',
    }
  );
}
export function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send({ error: 'Access denied' });
  }
  try {
    const decode = jwt.verify(token, process.env.SECRETKEY);
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).send({
      error: 'Invalid Token',
      err,
    });
  }
}

export function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      error: 'forbidden',
    });
  }
  // const token = req.header('Authorization');
  // if (!token) {
  //   return res.status(401).send({ error: 'Access denied' });
  // }
  // try {
  //   const decode = jwt.verify(token, process.env.SECRETKEY);
  //   if (decode.isAdmin) {
  //     next();
  //   } else {
  //     return res.status(403).send({
  //       error: 'forbidden',
  //     });
  //   }
  // } catch (err) {
  //   return res.status(401).send({
  //     error: 'Invalid Token',
  //     err,
  //   });
  // }
}
