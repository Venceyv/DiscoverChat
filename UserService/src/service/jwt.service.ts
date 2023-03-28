import jwt from 'jsonwebtoken';
import logger from '../config/logger.config';
import redis from '../config/redis.config';
import vars from '../config/vars.config';

type TokenType = 'refresh' | 'access' | 'verify';

//TODO
function generateToken(userInfo: object) {
  return new Promise((resolve, reject) => {
    jwt.sign(userInfo, vars.jwt.key, { expiresIn: '5h' }, (err, token) => {
      if (err) reject(new Error(err.message));
      else resolve(token);
    });
  });
}

//TODO
function generateRefreshToken(userInfo: object) {
  return new Promise((resolve, reject) => {
    jwt.sign(userInfo, vars.jwt.key, { expiresIn: 24 * 60 * 60 }, (err, token) => {
      if (err) reject(new Error(err.message));
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

async function blacklistToken(token: string, type: TokenType) {
  try {
    const key = token + ` Blacklist-${type}`;

    const decodedToken = jwt.verify(token, vars.jwt.key);
    if (typeof decodedToken == 'string' || !decodedToken || !decodedToken.exp) return;
    const tokenExpiredTime = decodedToken.exp * 1000 - new Date().getTime();
    await redis.blockList.setex(key, tokenExpiredTime, token);
    return true;
  } catch (error) {
    logger.error(error);
  }
}

async function checkBlacklistToken(token: string, type: TokenType) {
  try {
    const key = token + ` Blacklist-${type}`;

    const blacklistToken = await redis.blockList.get(key);
    return blacklistToken;
  } catch (error) {
    logger.error(error);
  }
}

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  blacklistToken,
  checkBlacklistToken,
};
