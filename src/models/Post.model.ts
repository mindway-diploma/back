import { model, Document, Schema } from "mongoose";


export interface IPost {
    content: string;
    images: string[];
    creator: Schema.Types.ObjectId;
    topic: string;
}

export interface IPostModel extends IPost, Document {
    _doc?: any
}

const PostSchema: Schema = new Schema<IPost>(
    {
        content: {
            type: String,
            required: true
        },
        images: [{
            type: String
        }],
        creator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        topic: {
            type: String,
            enum: ["General", "NEWS", "Trends", "Lifestyle", "ideas", "experiences"],
            default: "General"
        }
    },
    {
        timestamps: true,
    }
);

export const PostModel = model<IPostModel>('Post', PostSchema);