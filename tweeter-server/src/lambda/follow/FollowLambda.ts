import { FollowRequest, UserCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowRequest
): Promise<UserCountResponse> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.userToFollowAlias
  );

  return {
    followeeCount,
    followerCount,
    success: true,
    message: null,
  };
};
