import { AuthToken } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string
  ) {
    return this.service.loadMoreFollowees(
      requestingAlias,
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load followees";
  }
}
