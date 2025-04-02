import { FakeData, User, UserDto } from "tweeter-shared";
import { IFollowsDao } from "../dao/interface/IFollowsDao";
import { IUserDao } from "../dao/interface/IUserDao";

export class FollowService {
  private readonly followDao: IFollowsDao;

  constructor(followDao: IFollowsDao) {
    this.followDao = followDao;
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async loadMoreFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      const followers = await this.followDao.getPageOfFollowers(
        userAlias,
        pageSize,
        lastItem ? lastItem.alias : undefined
      );
      return [followers.items, followers.hasMore];
    } catch (error) {
      console.log(error);
      throw new Error("Server Error Failed to get followers", error as Error);
    }
  }

  public async loadMoreFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    try {
      const followers = await this.followDao.getPageOfFollowing(
        userAlias,
        pageSize,
        lastItem ? lastItem.alias : undefined
      );
      return [followers.items, followers.hasMore];
    } catch (error) {
      console.log(error);
      throw new Error("Server Error Failed to get followees", error as Error);
    }
  }

  public async getIsFollowerStatus(
    requestingUserAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const isFollower = await this.followDao.isFollowing(
      requestingUserAlias,
      selectedUserAlias
    );

    return isFollower;
  }

  public async getFolloweeCount(userAlias: string): Promise<number> {
    try {
      const followeeCount = await this.followDao.getFollowingCount(userAlias);
      return followeeCount;
    } catch (error) {
      throw new Error(
        "Server Error Failed to get followee count",
        error as Error
      );
    }
  }

  public async getFollowerCount(userAlias: string): Promise<number> {
    try {
      const followeeCount = await this.followDao.getFollowersCount(userAlias);
      return followeeCount;
    } catch (error) {
      console.log(error);
      throw new Error(
        "Server Error Failed to get follower count",
        error as Error
      );
    }
  }

  public async follow(
    requestingUserAlias: string,
    userToFollowAlias: string,
    userDao: IUserDao
  ): Promise<[followerCount: number, followeeCount: number]> {
    const requestingUserData = await userDao.getUser(requestingUserAlias);
    const userToFollowData = await userDao.getUser(userToFollowAlias);
    if (!requestingUserData || !userToFollowData) {
      throw new Error("User not found");
    }

    const requestingUser = User.fromDto(requestingUserData);
    const userToFollow = User.fromDto(userToFollowData);

    await this.followDao.addFollower(requestingUser!, userToFollow!);

    const followerCount = await this.getFollowerCount(userToFollowAlias);
    const followeeCount = await this.getFolloweeCount(userToFollowAlias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    requestingAlias: string,
    userToUnfollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followDao.unfollow(requestingAlias, userToUnfollowAlias);

    const followerCount = await this.getFollowerCount(userToUnfollowAlias);
    const followeeCount = await this.getFolloweeCount(userToUnfollowAlias);

    return [followerCount, followeeCount];
  }
}
