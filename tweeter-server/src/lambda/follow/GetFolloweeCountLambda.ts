import { FollowsCountResponse, GetFollowsCountRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { UserService } from "../../model/service/UserService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";

export const handler = async (
  request: GetFollowsCountRequest
): Promise<FollowsCountResponse | undefined> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);

  try {
    if (
      await userService.verifyAuthToken(request.requestingAlias, request.token)
    ) {
      const followService = new FollowService(new FollowDao());
      const followeeCount = await followService.getFolloweeCount(
        request.userAlias
      );

      return {
        count: followeeCount,
        success: true,
        message: null,
      };
    }
  } catch (error) {
    throw error;
  }
};
