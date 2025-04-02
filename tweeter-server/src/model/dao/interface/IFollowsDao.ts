import { UserDto } from "tweeter-shared";

export interface IFollowsDao {
  getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastFollowerAlias?: string
  ): Promise<any>;
  getPageOfFollowing(
    userAlias: string,
    pageSize: number,
    lastFollowingAlias?: string
  ): Promise<any>;
  addFollower(
    requestingUserData: UserDto,
    userToFollowData: UserDto
  ): Promise<void>;
  unfollow(requestingAlias: string, unfollowAlias: string): Promise<void>;
  isFollowing(requestingAlias: string, followerAlias: string): Promise<boolean>;
  getFollowersCount(userAlias: string): Promise<number>;
  getFollowingCount(userAlias: string): Promise<number>;
}

export interface IFollowsDaoFactory {
  createFollowsDao(): IFollowsDao;
}
