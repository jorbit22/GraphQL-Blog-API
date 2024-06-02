import { UserInputError, AuthenticationError } from "apollo-server-express";
import PostModel from "../models/Post";
import CommentModel from "../models/Comment";

const postResolver = {
  Query: {
    getPost: async (
      _: any,
      { id }: { id: string },
      { user }: { user: any }
    ) => {
      const post = await PostModel.findById(id);
      if (!post) throw new UserInputError("Post not found");

      return post;
    },
    getAllPosts: async () => {
      try {
        const posts = await PostModel.find()
          .populate("author")
          .populate("comments");
        return posts;
      } catch (error) {
        throw new Error(`Error fetching posts: ${(error as Error).message}`);
      }
    },
  },
  Mutation: {
    createPost: async (
      _: any,
      { title, content }: { title: string; content: string },
      { user }: { user: any }
    ) => {
      if (!user)
        throw new AuthenticationError("You must be logged in to create a post");

      try {
        const newPost = new PostModel({ title, content, author: user.userId });
        await newPost.save();
        return newPost;
      } catch (error) {
        throw new Error(`Error creating post: ${(error as Error).message}`);
      }
    },
  },
};

export default postResolver;
