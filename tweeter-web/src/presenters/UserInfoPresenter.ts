import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";

export class UserInfoPresenter extends LoadingPresenter<
  LoadingView,
  FollowService
> {
  private _isFollower: boolean = false;
  private _followeeCount: number = -1;
  private _followerCount: number = -1;

  protected createService() {
    return new FollowService();
  }

  public get isFollower() {
    return this._isFollower;
  }

  public get followeeCount() {
    return this._followeeCount;
  }

  public get followerCount() {
    return this._followerCount;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(
      async () => {
        if (currentUser === displayedUser) {
          this._isFollower = false;
        } else {
          this._isFollower = await this.service.getIsFollowerStatus(
            authToken,
            currentUser,
            displayedUser
          );
        }
      },
      "determine follower status",
      () => null
    );
  }

  public async setNumbFollowees(
    requestingAlias: string,
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(
      async () => {
        this._followeeCount = await this.service.getFolloweeCount(
          requestingAlias,
          authToken,
          displayedUser
        );
      },
      "get followees count",
      () => null
    );
  }

  public async setNumbFollowers(
    requestingAlias: string,
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(
      async () => {
        this._followerCount = await this.service.getFollowerCount(
          requestingAlias,
          authToken,
          displayedUser
        );
      },
      "get followers count",
      () => null
    );
  }

  public async followDisplayedUser(
    currentUserAlias: string,
    displayedUser: User,
    authToken: AuthToken
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage!(`Following ${displayedUser.name}...`, 0);

        const [followerCount, followeeCount] = await this.service.follow(
          currentUserAlias,
          authToken!,
          displayedUser!
        );

        this._isFollower = true;
        this._followerCount = followerCount;
        this._followeeCount = followeeCount;
      },
      "follow user",
      () => {
        this.view.clearLastInfoMessage!();
        this.isLoading = false;
      }
    );
  }

  public async unfollowDisplayedUser(
    currentUserAlias: string,
    displayedUser: User,
    authToken: AuthToken
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage!(
          `Unfollowing ${displayedUser.name}...`,
          0
        );

        const [followerCount, followeeCount] = await this.service.unfollow(
          currentUserAlias,
          authToken!,
          displayedUser!
        );

        this._isFollower = false;
        this._followerCount = followerCount;
        this._followeeCount = followeeCount;
      },
      "unfollow user",
      () => {
        this.view.clearLastInfoMessage!();
        this.isLoading = false;
      }
    );
  }
}
