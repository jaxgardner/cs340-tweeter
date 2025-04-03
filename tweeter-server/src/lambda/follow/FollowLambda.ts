import { FollowRequest, UserCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: FollowRequest
): Promise<UserCountResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
      const followDao = new FollowDao();
      const followService = new FollowService(followDao);
      const [followerCount, followeeCount] = await followService.follow(
        request.requestingAlias,
        request.userToFollowAlias,
        new UserDaoFactory().createUserDao()
      );

      return {
        followeeCount,
        followerCount,
        success: true,
        message: null,
      };
    }
  );
};
