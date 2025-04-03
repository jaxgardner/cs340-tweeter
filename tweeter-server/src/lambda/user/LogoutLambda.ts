import { TweeterRequest } from "tweeter-shared";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { UserService } from "../../model/service/UserService";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (request: TweeterRequest): Promise<void> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
      const userDaoFactory = new UserDaoFactory();
      const userService = new UserService(userDaoFactory);
      await userService.logout(request.requestingAlias);
    }
  );
};
