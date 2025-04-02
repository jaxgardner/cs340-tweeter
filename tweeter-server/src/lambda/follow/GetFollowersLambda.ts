import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse | undefined> => {
  const userDaoFactory = new UserDaoFactory();
  const userService = new UserService(userDaoFactory);
  try {
    if (
      await userService.verifyAuthToken(request.requestingAlias, request.token)
    ) {
      const followService = new FollowService(new FollowDao());
      const [items, hasMore] = await followService.loadMoreFollowers(
        request.userAlias,
        request.pageSize,
        request.lastItem
      );

      return {
        success: true,
        message: null,
        items,
        hasMore,
      };
    }
  } catch (error) {
    console.error("Error in GetFollowersLambda:", error);
    throw error;
  }
};
