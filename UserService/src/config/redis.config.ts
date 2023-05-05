import Redis from 'ioredis';
import vars from './vars.config';

const blockList = new Redis({
  port: vars.redis.port,
  host: vars.redis.host,
  username: vars.redis.username,
  password: vars.redis.password,
});

export default {
  blockList,
};
