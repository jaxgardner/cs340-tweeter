import { PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { UserService } from "../../model/service/UserService";
import { StatusDaoFactory } from "../../model/dao/concrete/StatusDaoFactory";
import { FollowDaoFactory } from "../../model/dao/concrete/FollowDaoFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse | undefined> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);
  try {
    if (
      await userService.verifyAuthToken(request.requestingAlias, request.token)
    ) {
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
  } catch (error) {
    console.error("Error posting status:", error);
    throw error;
  }
};
