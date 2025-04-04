import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";

const PAGE_SIZE = 10;

export class StoryScrollerPresenter extends StatusItemPresenter {
  protected getMoreItems(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string
  ) {
    return this.service.loadMoreStoryItems(
      requestingAlias,
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load story items";
  }
}
