import { UnfollowRequest, UserCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: UnfollowRequest
): Promise<UserCountResponse> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.userToUnfollowAlias
  );

  return {
    followeeCount,
    followerCount,
    success: true,
    message: null,
  };
};
