import { FollowsCountResponse, GetFollowsCountRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: GetFollowsCountRequest
): Promise<FollowsCountResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
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
  );
};
