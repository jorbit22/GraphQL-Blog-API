import { gql } from "apollo-server-express";

const commentTypeDef = gql`
  type Comment {
    id: ID!
    text: String!
    post: Post!
    author: User!
  }

  extend type Query {
    getComment(id: ID!): Comment
  }

  extend type Mutation {
    createComment(text: String!, postId: ID!, authorId: ID!): Comment
  }
`;

export default commentTypeDef;
