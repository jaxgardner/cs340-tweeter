import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./useUserInfo";
import { UserInfoPresenter } from "../../presenters/UserInfoPresenter";
import { User } from "tweeter-shared";

const UserInfo = () => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const [presenter] = useState(
    new UserInfoPresenter({
      displayErrorMessage,
      displayInfoMessage,
      clearLastInfoMessage,
    })
  );

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();

  const [forceUpdate, setForceUpdate] = useState(0); // State to trigger re-renders

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    // Register the state change callback
    presenter.setStateChangeCallback(() => {
      setForceUpdate((prev) => prev + 1); // Increment to trigger re-render
    });

    if (authToken && currentUser && displayedUser) {
      presenter.setIsFollowerStatus(authToken, currentUser, displayedUser);
      presenter.setNumbFollowees(currentUser.alias, authToken, displayedUser);
      presenter.setNumbFollowers(currentUser.alias, authToken, displayedUser);
    }

    return () => {
      presenter.setStateChangeCallback(() => undefined); // Clear callback on unmount
    };
  }, [authToken, currentUser, displayedUser]);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();
    await presenter.followDisplayedUser(
      currentUser!.alias,
      displayedUser!,
      authToken!
    );
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();
    await presenter.unfollowDisplayedUser(
      currentUser!.alias,
      displayedUser!,
      authToken!
    );
  };

  return (
    <div className={presenter.isLoading ? "loading" : ""}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {presenter.followeeCount > -1 && presenter.followerCount > -1 && (
                <div>
                  Followees: {presenter.followeeCount} Followers:{" "}
                  {presenter.followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {presenter.isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => unfollowDisplayedUser(event)}
                    >
                      {presenter.isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => followDisplayedUser(event)}
                    >
                      {presenter.isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
