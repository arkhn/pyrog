import { authMutation } from "./Mutation/auth";
import { pyrogMutation } from "./Mutation/pyrog";
import { pyrogQuery } from "./Query/pyrog";
import { pyrogSubscription } from "./Subscription/pyrog";

export default {
  Query: {
    ...pyrogQuery
  },
  Mutation: {
    ...authMutation,
    ...pyrogMutation
  },
  Subscription: {
    ...pyrogSubscription
  }
};
