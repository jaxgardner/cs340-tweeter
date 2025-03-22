import { UserService } from "../../model/service/UserService";
import { TweeterRequest } from "tweeter-shared/dist/model/net/request/TweeterRequest";

export const handler = async (request: TweeterRequest): Promise<void> => {
  const userService = new UserService();
  await userService.logout(request.token);
};
