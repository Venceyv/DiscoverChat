import mongoose from "mongoose";

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-20 06:21:33
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-20 06:21:37
 * @FilePath: \discoveryChat(chat)\models\user.model.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      firstName: {
        type: String,
        default: '',
      },
      lastName: {
        type: String,
        default: '',
      },
      birthday: {
        type: Date,
        default: null,
      },
      profilePic: {
        type: String,
        default: '',
      },
      majorList: {
        type: [String],
        default: [],
      },
      description: {
        type: String,
        default: '',
      },
      gender: {
        type: String,
        default: '',
      },
      isDeactivated: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );