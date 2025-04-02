import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/useUserInfo";
import {
  PagedItemPresenter,
  PagedItemView,
} from "../../presenters/PagedItemPresenter";

interface Props<Item, Service> {
  presenterGenerator: (
    view: PagedItemView<Item>
  ) => PagedItemPresenter<Item, Service>;
  itemGenerator: (item: Item) => React.ReactNode;
}

const ItemScroller = <Item, Service>(props: Props<Item, Service>) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Item[]>([]);
  const [newItems, setNewItems] = useState<Item[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const { displayedUser, authToken, currentUser } = useUserInfo();

  // Combine the reset and initial load logic into a single useEffect to avoid duplicate renders
  useEffect(() => {
    const initialize = async () => {
      await reset();
      await loadMoreItems();
    };
    initialize();
  }, [displayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(false); // Ensure this is set to false to prevent triggering loadMoreItems again
    presenter.reset();
  };

  const listener: PagedItemView<Item> = {
    addItems: (newItems: Item[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(
      currentUser!.alias,
      authToken!,
      displayedUser!.alias
    );
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.itemGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
