import {
  GetIsFollowerStatusRequest,
  IsFollowerStatusResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<IsFollowerStatusResponse> => {
  const followService = new FollowService();
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.userAlias,
    request.selectedUserAlias
  );

  return {
    isFollower,
    success: true,
    message: null,
  };
};
