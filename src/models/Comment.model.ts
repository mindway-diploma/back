import { model, Document, Schema } from "mongoose";


export interface IComment {
    post: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    parentComment: Schema.Types.ObjectId,
    mentions: Schema.Types.ObjectId[],
    text: string;
    images: string[];
    replies?: IComment[];
}

export interface ICommentModel extends IComment, Document {
    _doc?: any
}

const CommentSchema: Schema = new Schema<IComment>(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        mentions: [{ 
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        images: [{
            type: String
        }],
        text: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

export const CommentModel = model<ICommentModel>('Comment', CommentSchema);