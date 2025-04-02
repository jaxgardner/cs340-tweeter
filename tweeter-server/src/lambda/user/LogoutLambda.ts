import { TweeterRequest } from "tweeter-shared";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: TweeterRequest): Promise<void> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);
  try {
    if (
      await userService.verifyAuthToken(request.requestingAlias, request.token)
    ) {
      await userService.logout(request.requestingAlias);
    }
  } catch (error) {
    throw error;
  }
};
