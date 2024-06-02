import { UserInputError, AuthenticationError } from "apollo-server-express";
import UserModel from "../models/User";
import CommentModel from "../models/Comment";
import PostModel from "../models/Post";

const commentResolver = {
  Query: {
    getComment: async (_: any, { id }: { id: string }) => {
      const comment = await CommentModel.findById(id);
      if (!comment) throw new UserInputError("Comment not found");

      return comment;
    },
  },
  Mutation: {
    createComment: async (
      _: any,
      {
        text,
        postId,
        authorId,
      }: { text: string; postId: string; authorId: string },
      { user }: { user: any }
    ) => {
      if (!user)
        throw new AuthenticationError(
          "You must be logged in to create a comment"
        );

      try {
        const newComment = new CommentModel({
          text,
          post: postId,
          author: authorId,
        });
        await newComment.save();
        return newComment;
      } catch (error) {
        throw new Error(`Error creating comment: ${(error as Error).message}`);
      }
    },
  },
};

export default commentResolver;
