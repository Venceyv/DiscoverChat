import { discoverLogger } from "../configs/logger.config";
import { redisFriendList } from "../configs/redis.config";
import { Request,Response } from "express";
export const getRecommand = async (req: Request, res: Response) => {
  try {
    const userId = req.body.requester;
    const [friendList] = await Promise.all([redisFriendList.lrange(userId, 0, -1)]);

    return res.status(200).json({ friendList });
  } catch (error) {
    discoverLogger.error(error);
    console.log(error);
  }
};
//emmmmm....