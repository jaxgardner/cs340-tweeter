import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);
  try {
    const [user, authToken] = await userService.login(
      request.alias,
      request.password
    );

    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken.toJson(),
    };
  } catch (error) {
    throw error;
  }
};
