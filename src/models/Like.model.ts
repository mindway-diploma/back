import { model, Document, Schema } from "mongoose";

export interface ILike {
  objectId: Schema.Types.ObjectId;
  objectType: "Post" | "Comment" | "UserReview" | "ProductReview" | "Event";
  user: Schema.Types.ObjectId;
}

export interface ILikeModel extends ILike, Document {
  _doc?: any;
}

const LikeSchema: Schema = new Schema<ILike>(
  {
    objectId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "objectType",
    },
    objectType: {
      type: String,
      enum: ["Post", "Comment"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LikeModel = model<ILikeModel>("Like", LikeSchema);
