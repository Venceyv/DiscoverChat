import { User } from "../models/index.model";
import { UserProfileType, UserProfileTypeWithID, userProfileNotFound, userProfileOther, userProfileSelf } from "../services/profile";
import { isFriends } from "../services/friendList.service";
import { NextFunction, Request, Response } from "express";

export const getUser =async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.params.userId;
        const requesterId = req.body.user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.json(userProfileNotFound());
        return;
      }
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
      const isFriend = await isFriends(requesterId,userId);
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
        isBlock: false, //! TODO: determine if is blocked
      };
      res.status(200).json(userProfileOther(data,requesterId));
    } catch (err) {
      next(err);
    }
  }