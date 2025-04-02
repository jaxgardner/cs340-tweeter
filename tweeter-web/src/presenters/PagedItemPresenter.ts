import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface PagedItemView<Item> extends View {
  addItems: (items: Item[]) => void;
}

export const PAGE_SIZE = 10;

export abstract class PagedItemPresenter<Item, Service> extends Presenter<
  PagedItemView<Item>,
  Service
> {
  private _hasMoreItems = false;
  private _lastItem: Item | null = null;

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(lastItem: Item | null) {
    this._lastItem = lastItem;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = false;
  }

  public async loadMoreItems(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string
  ) {
    this.doFailureReportingOperation(
      async () => {
        const [newItems, hasMore] = await this.getMoreItems(
          requestingAlias,
          authToken,
          userAlias
        );

        console.log(hasMore);
        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      },
      this.getItemDescription(),
      () => null
    );
  }

  protected abstract getMoreItems(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Item[], boolean]>;

  protected abstract getItemDescription(): string;
}
