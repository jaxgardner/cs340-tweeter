import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowers(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowers({
      requestingAlias,
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }

  public async loadMoreFollowees(
    requestingAlias: string,
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowees({
      requestingAlias,
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.serverFacade.getIsFollowerStatus({
      requestingAlias: user.alias,
      token: authToken.token,
      userAlias: user.alias,
      selectedUserAlias: selectedUser.alias,
    });
  }

  public async getFolloweeCount(
    requestingAlias: string,
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.serverFacade.getFolloweeCount({
      requestingAlias,
      token: authToken.token,
      userAlias: user.alias,
    });
  }

  public async getFollowerCount(
    requestingAlias: string,
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.serverFacade.getFollowerCount({
      requestingAlias: requestingAlias,
      token: authToken.token,
      userAlias: user.alias,
    });
  }

  public async follow(
    requestingAlias: string,
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const { followerCount, followeeCount } = await this.serverFacade.follow({
      requestingAlias: requestingAlias,
      token: authToken.token,
      userToFollowAlias: userToFollow.alias,
    });

    return [followerCount, followeeCount];
  }

  public async unfollow(
    requestingAlias: string,
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const { followerCount, followeeCount } = await this.serverFacade.unfollow({
      requestingAlias: requestingAlias,
      token: authToken.token,
      userToUnfollowAlias: userToUnfollow.alias,
    });

    return [followerCount, followeeCount];
  }
}
