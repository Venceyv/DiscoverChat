import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.SchemaTypes.ObjectId,
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

export default userSchema;
