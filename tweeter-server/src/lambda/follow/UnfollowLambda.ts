import { UnfollowRequest, UserCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UnfollowRequest
): Promise<UserCountResponse | undefined> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);
  try {
    if (
      await userService.verifyAuthToken(request.requestingAlias, request.token)
    ) {
      const followDao = new FollowDao();
      const followService = new FollowService(followDao);
      const [followerCount, followeeCount] = await followService.unfollow(
        request.requestingAlias,
        request.userToUnfollowAlias
      );

      return {
        followeeCount,
        followerCount,
        success: true,
        message: null,
      };
    }
  } catch (error) {
    throw error;
  }
};
