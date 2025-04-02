import { FollowsCountResponse, GetFollowsCountRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetFollowsCountRequest
): Promise<FollowsCountResponse | undefined> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);

  const followService = new FollowService(new FollowDao());
  try {
    if (
      await userService.verifyAuthToken(request.requestingAlias, request.token)
    ) {
      const followeeCount = await followService.getFollowerCount(
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
