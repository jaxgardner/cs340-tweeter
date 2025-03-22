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
  private _hasMoreItems = true;
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
    this._hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(
      async () => {
        const [newItems, hasMore] = await this.getMoreItems(
          authToken,
          userAlias
        );

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      },
      this.getItemDescription(),
      () => null
    );
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Item[], boolean]>;

  protected abstract getItemDescription(): string;
}
