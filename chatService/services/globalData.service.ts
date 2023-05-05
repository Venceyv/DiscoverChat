import { redisGlobalData } from "../configs/redis.config";

export const saveGlobalData = async (key: string, data: string|object|any[]) => {
  try {
    data = JSON.stringify(data);
    await redisGlobalData.setex(key, 10, data);
  } catch (error) {
    console.log(error);
  }
};
export const retrieveGlobalData = async (key: string):Promise<string|undefined> => {
  try {
    let data;
    while (!data) {
      data = await redisGlobalData.get(key);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
