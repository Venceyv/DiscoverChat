import { UserProfileType, UserProfileTypeWithID, userProfileInBlock, userProfileNotFound, userProfileOther, userProfileSelf } from "../services/profile";
import { isFriends } from "../services/friendList.service";
import { NextFunction, Request, Response } from "express";
import { inList } from "../services/blockList.service";

export const getUser =async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.params.userId;
        const requesterId = req.body.user._id;
      const user = req.body.paramUser;
      if (requesterId == req.params.userId) {
        const data: UserProfileType = {
            _id:user._id.toString(),
          userImageUrl: user.profilePic,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          major: user.majorList,
          birthday: user.birthday,
          description: user.description,
        };
        res.status(200).json(userProfileSelf(data));
        return;
      }
      // Not self
      const [isFriend,isBlock] = await Promise.all(
        [
            isFriends(requesterId,userId),
            inList(requesterId,userId)
        ]
      );
      const data: UserProfileTypeWithID = {
        _id: user.id,
        userImageUrl: user.profilePic,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        major: user.majorList,
        birthday: user.birthday,
        description: user.description,
        isFriend: isFriend as boolean, //! TODO: determine if is friend
        isBlock: isBlock as boolean, //! TODO: determine if is blocked
      };
      const response = isBlock?userProfileInBlock(data,requesterId):userProfileOther(data,requesterId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }