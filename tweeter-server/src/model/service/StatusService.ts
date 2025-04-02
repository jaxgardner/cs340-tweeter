import { StatusDto } from "tweeter-shared";
import { IStatusDao } from "../dao/interface/IStatusDao";
import { IFollowsDao } from "../dao/interface/IFollowsDao";

export class StatusService {
  private readonly statusDao: IStatusDao;

  constructor(statusDao: IStatusDao) {
    this.statusDao = statusDao;
  }

  public async loadMoreStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = await this.statusDao.loadMoreStoryItems(
      userAlias,
      pageSize,
      lastItem
    );
    return [items, hasMore];
  }

  public async loadMoreFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = await this.statusDao.loadMoreFeedItems(
      userAlias,
      pageSize,
      lastItem
    );
    return [items, hasMore];
  }

  public async postStatus(
    requestingAlias: string,
    newStatus: StatusDto,
    followingDao: IFollowsDao
  ): Promise<void> {
    try {
      const followers = await followingDao.getPageOfFollowers(
        requestingAlias,
        Number.MAX_SAFE_INTEGER,
        undefined
      );

      const followerAliases = followers.items
        ? followers.items.map((follower: Record<string, any>) => follower.alias)
        : [];

      return await this.statusDao.postStatus(
        requestingAlias,
        newStatus,
        followerAliases
      );
    } catch (error) {
      console.log(error);
      throw new Error("Server Error Failed to post status", error as Error);
    }
  }
}
