import { AuthChecker } from "type-graphql";

import { Context } from "./Context";

// create auth checker function
export const authChecker: AuthChecker<Context> = (
  { context: { user } },
  roles,
) => {
  // Do not check user role.
  if (roles.length === 0) {
    // Check if a user is signed in and do not check any roles.
    return user !== undefined;
  }
  // Check user role.
  else {
    // Check if user is signed in.
    if (!user) {
      return false;
    }
    // Check if user has a given role.
    return user.roles.some(role => roles.includes(role));
  }
};
