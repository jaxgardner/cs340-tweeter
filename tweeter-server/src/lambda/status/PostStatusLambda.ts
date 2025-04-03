import { PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { StatusDaoFactory } from "../../model/dao/concrete/StatusDaoFactory";
import { FollowDaoFactory } from "../../model/dao/concrete/FollowDaoFactory";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
      const statusDaoFactory = new StatusDaoFactory();
      const statusService = new StatusService(
        statusDaoFactory.createStatusDao()
      );
      const followDaoFactory = new FollowDaoFactory();
      await statusService.postStatus(
        request.requestingAlias,
        request.newStatus,
        followDaoFactory.createFollowsDao()
      );

      return {
        success: true,
        message: null,
      };
    }
  );
};
