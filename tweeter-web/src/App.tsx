import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/useUserInfo";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter } from "./presenters/RegisterPresenter";
import { StoryScrollerPresenter } from "./presenters/StoryScrollerPresenter";
import { FeedScrollerPresenter } from "./presenters/FeedScrollerPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { PagedItemView } from "./presenters/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller
              key={"feed-scroller"}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new FeedScrollerPresenter(view)
              }
              itemGenerator={(status: Status) => <StatusItem item={status} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={"story-scroller"}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new StoryScrollerPresenter(view)
              }
              itemGenerator={(status: Status) => <StatusItem item={status} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={"followees-scroller"}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemGenerator={(user: User) => <UserItem value={user} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={"followers-scroller"}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemGenerator={(user: User) => <UserItem value={user} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login presenterGenerator={(view) => new LoginPresenter(view)} />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            presenterGenerator={(view) => new RegisterPresenter(view)}
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            originalUrl={location.pathname}
            presenterGenerator={(view) => new LoginPresenter(view)}
          />
        }
      />
    </Routes>
  );
};

export default App;
