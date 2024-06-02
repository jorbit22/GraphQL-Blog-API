import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./userResolvers";
import postResolver from "./postResolvers";
import commentResolver from "./commentResolvers";

const resolvers = [userResolver, postResolver, commentResolver];

export default mergeResolvers(resolvers);
