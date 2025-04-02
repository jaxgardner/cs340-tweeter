import {
  LoadStatusItemsRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { StatusDaoFactory } from "../../model/dao/concrete/StatusDaoFactory";
import { UserService } from "../../model/service/UserService";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";

export const handler = async (
  request: LoadStatusItemsRequest
): Promise<PagedStatusItemResponse | undefined> => {
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
  } catch (error) {
    console.error("Error loading more story items:", error);
    throw error;
  }
};
