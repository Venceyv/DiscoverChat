/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:48:14
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-06 18:20:22
 * @FilePath: \discoveryChat(ts)\configs\mongoose.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from 'mongoose';
mongoose.set("strictQuery", false);
const mongooseConfig = async (CONNECTION_URL:any) => {
  try {
    await mongoose.connect(CONNECTION_URL);
    console.log('MongoDB connection established.');
  } catch (error) {
    console.log(error);
    return new Error('MongoDB connect failed.');
  }
};

export default mongooseConfig;