import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
      const userDaoFactory = new UserDaoFactory();
      const userService = new UserService(userDaoFactory);
      const user = await userService.getUser(request.alias);

      return {
        success: true,
        message: null,
        user: user,
      };
    }
  );
};
