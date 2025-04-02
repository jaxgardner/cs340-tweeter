import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedScrollerPresenter extends StatusItemPresenter {
  protected getItemDescription() {
    return "load feed items";
  }

  protected getMoreItems(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string
  ) {
    return this.service.loadMoreFeedItems(
      requestingAlias,
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}
