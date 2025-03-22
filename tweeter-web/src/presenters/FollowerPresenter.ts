import { AuthToken } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFollowees(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load followers";
  }
}
