import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
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
