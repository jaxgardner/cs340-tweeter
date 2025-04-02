import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreStoryItems(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreStoryItems({
      requestingAlias,
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }

  public async loadMoreFeedItems(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreFeedItems({
      requestingAlias,
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }

  public async postStatus(
    requestingAlias: string,
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    return this.serverFacade.postStatus({
      requestingAlias,
      token: authToken.token,
      newStatus: newStatus.dto,
    });
  }
}
