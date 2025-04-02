import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse | undefined> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);
  try {
    if (
      await userService.verifyAuthToken(request.requestingAlias, request.token)
    ) {
      const user = await userService.getUser(request.alias);

      return {
        success: true,
        message: null,
        user: user,
      };
    }
  } catch (error) {
    throw error;
  }
};
