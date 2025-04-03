import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDao } from "../../model/dao/concrete/FollowDao";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
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
  );
};
