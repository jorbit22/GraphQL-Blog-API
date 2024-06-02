import { gql } from "apollo-server-express";

const postTypeDef = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
  }

  extend type Query {
    getPost(id: ID!): Post
    getAllPosts: [Post!]!
  }

  extend type Mutation {
    createPost(title: String!, content: String!): Post
  }
`;

export default postTypeDef;
