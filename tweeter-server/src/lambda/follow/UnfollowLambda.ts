import { UnfollowRequest, UserCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: UnfollowRequest
): Promise<UserCountResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
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
  );
};
