import {
  LoadStatusItemsRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { StatusDaoFactory } from "../../model/dao/concrete/StatusDaoFactory";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: LoadStatusItemsRequest
): Promise<PagedStatusItemResponse | undefined> => {
  const authService = new AuthService();
  return authService.handleAuthenticatedRequest(
    request.requestingAlias,
    request.token,
    async () => {
      const statusDaoFactory = new StatusDaoFactory();
      const statusService = new StatusService(
        statusDaoFactory.createStatusDao()
      );
      const [items, hasMore] = await statusService.loadMoreStoryItems(
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
