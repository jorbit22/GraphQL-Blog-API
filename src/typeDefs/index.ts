import { gql } from "apollo-server-express";
import userTypeDef from "./user.typeDef";
import commentTypeDef from "./comment.typeDef";
import postTypeDef from "./post.typeDef";

const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [rootTypeDefs, userTypeDef, commentTypeDef, postTypeDef];

export default typeDefs;
