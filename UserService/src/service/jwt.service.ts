import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import vars from '../config/vars.config';

function generateToken(userInfo: any) {
  return new Promise((resolve, reject) => {
    jwt.sign(userInfo, vars.jwt.key, { expiresIn: '5h' }, (err, token) => {
      if (err) reject(null);
      else resolve(token);
    });
  });
}

function generateRefreshToken(userInfo: any) {
  return new Promise((resolve, reject) => {
    jwt.sign(userInfo, vars.jwt.key, { expiresIn: 24 * 60 * 60 }, (err, token) => {
      if (err) reject(err.message);
      else resolve(token);
    });
  });
}

function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, vars.jwt.key, (err, decoded) => {
      if (err) reject(err);

      if (!token) reject(err);
      else resolve(decoded);
    });
  });
}

export default { generateToken, generateRefreshToken, verifyToken };
