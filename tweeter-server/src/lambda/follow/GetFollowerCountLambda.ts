import { FollowsCountResponse, GetFollowsCountRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: GetFollowsCountRequest
): Promise<FollowsCountResponse> => {
  const followService = new FollowService();
  const followeeCount = await followService.getFollowerCount(
    request.token,
    request.userAlias
  );

  return {
    count: followeeCount,
    success: true,
    message: null,
  };
};
