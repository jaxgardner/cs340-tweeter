import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedScrollerPresenter extends StatusItemPresenter {
  protected getItemDescription() {
    return "load feed items";
  }

  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFeedItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}
