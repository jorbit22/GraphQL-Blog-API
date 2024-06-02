import { gql } from "apollo-server-express";

const userTypeDef = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    getUser(id: ID!): User
    getAllUsers: [User!]!
  }

  extend type Mutation {
    signUp(name: String!, email: String!, password: String!): AuthPayload
    signIn(email: String!, password: String!): AuthPayload
  }
`;

export default userTypeDef;
