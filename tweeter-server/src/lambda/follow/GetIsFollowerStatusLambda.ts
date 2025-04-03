import {
  GetIsFollowerStatusRequest,
  IsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<IsFollowerStatusResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
      const followDao = new FollowDao();
      const followService = new FollowService(followDao);
      const isFollower = await followService.getIsFollowerStatus(
        request.requestingAlias,
        request.selectedUserAlias
      );

      return {
        isFollower,
        success: true,
        message: null,
      };
    }
  );
};
